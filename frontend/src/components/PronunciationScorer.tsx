'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, RefreshCcw, Trophy, Loader2, ArrowRight, AlertTriangle, RotateCcw, Frown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { ContentItem } from '@/types/lesson'; 

interface ScorerProps {
  sentences: ContentItem[];
  isLocked?: boolean;
}

export default function PronunciationScorer({ sentences, isLocked = false }: ScorerProps) {
  if (!sentences || sentences.length === 0) return <div className="text-center p-10 font-bold text-slate-400">Chưa có bài tập nào.</div>;
  if (isLocked) return null;

  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null); 
  const [lessonComplete, setLessonComplete] = useState(false); 
  const [lessonScores, setLessonScores] = useState<number[]>([]);
  const [displayScore, setDisplayScore] = useState(0);
  const [calculatedMetrics, setCalculatedMetrics] = useState({ completeness: 0, accuracy: 0, fluency: 0 });

  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const currentSentence = sentences[currentIndex];

  useEffect(() => {
    return () => {
      if (recognizerRef.current) recognizerRef.current.close();
    };
  }, []);

  // --- LOGIC GIỮ NGUYÊN ---
  const processStrictResult = (jsonResult: any) => {
    if (!jsonResult || !jsonResult.NBest || !jsonResult.NBest[0]) return 0;
    const nbest = jsonResult.NBest[0];
    const words = nbest.Words || [];
    const azureAssessment = nbest.PronunciationAssessment || { AccuracyScore: 0, FluencyScore: 0 };

    const cleanRefText = currentSentence.phrase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
    const totalExpectedWords = cleanRefText.trim().split(/\s+/).length;
    
    if (totalExpectedWords === 0) return 0;

    let validWordCount = 0;
    words.forEach((w: any) => {
        if (w.PronunciationAssessment?.ErrorType !== 'Omission') validWordCount++;
    });

    let realCompleteness = Math.round((validWordCount / totalExpectedWords) * 100);
    if (realCompleteness > 100) realCompleteness = 100;
    const realAccuracy = validWordCount > 0 ? azureAssessment.AccuracyScore : 0;
    let weightedScore = realAccuracy * (realCompleteness / 100);
    const fluencyScore = azureAssessment.FluencyScore || 0; 
    if (fluencyScore < 60) weightedScore = weightedScore * 0.9;

    const hasAnyError = words.some((w: any) => w.PronunciationAssessment?.ErrorType !== 'None');
    let finalScore = Math.round(weightedScore);
    
    if (realCompleteness < 100 && finalScore >= 100) finalScore = 99;
    if (hasAnyError && finalScore >= 100) finalScore = 99;

    setCalculatedMetrics({
        completeness: realCompleteness,
        accuracy: Math.round(realAccuracy),
        fluency: Math.round(fluencyScore)
    });

    return finalScore;
  };

  const startRecording = async () => {
    setResult(null);
    setDisplayScore(0);
    setIsRecording(true);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/speech-token', { method: 'POST' });
      if (!response.ok) throw new Error("Lỗi lấy token từ server");
      
      const { token, region } = await response.json();
      setIsProcessing(false); 

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = "en-US";
      speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;
      speechConfig.setProperty(SpeechSDK.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "5000");
      speechConfig.setProperty(SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "3000");

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
        currentSentence.phrase, 
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
        true 
      );
      pronunciationConfig.enableProsodyAssessment = true; 

      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      pronunciationConfig.applyTo(recognizer);

      recognizer.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          try {
             const jsonString = e.result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
             const jsonResult = JSON.parse(jsonString);
             setResult(jsonResult);
             const score = processStrictResult(jsonResult);
             setDisplayScore(score);
          } catch (err) { console.error("Lỗi parse JSON:", err); }
        }
        stopRecording();
      };

      recognizer.canceled = (s, e) => { stopRecording(); };
      recognizer.sessionStopped = (s, e) => { stopRecording(); };
      recognizer.startContinuousRecognitionAsync();
      recognizerRef.current = recognizer;

    } catch (error) {
      console.error(error);
      setIsRecording(false);
      setIsProcessing(false);
      alert("Lỗi kết nối Micro hoặc Token.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      recognizerRef.current.close();
      recognizerRef.current = null;
    }
  };

  const handleNextSentence = () => {
    const newScores = [...lessonScores, displayScore];
    setLessonScores(newScores);
    setResult(null); 
    setDisplayScore(0);
    setCalculatedMetrics({ completeness: 0, accuracy: 0, fluency: 0 });
    
    if (currentIndex < sentences.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else {
        setLessonComplete(true); 
    }
  };

  const handleRestartLesson = () => {
    setLessonComplete(false);
    setCurrentIndex(0);
    setResult(null);
    setDisplayScore(0);
    setLessonScores([]); 
    setCalculatedMetrics({ completeness: 0, accuracy: 0, fluency: 0 });
  };

  const renderHighlightedText = () => {
    if (!result) return (
        <div className="flex flex-col items-center gap-3">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-700 text-center leading-relaxed transition-all drop-shadow-sm">
                {currentSentence.phrase}
            </h3>
            <div className="flex flex-col items-center gap-1.5 mt-2">
                {currentSentence.transcription && (
                    <span className="text-blue-500 font-mono text-base md:text-xl bg-blue-50 px-4 py-1 rounded-full border border-blue-100">
                        /{currentSentence.transcription}/
                    </span>
                )}
                {currentSentence.translation && (
                    <p className="text-slate-500 font-bold text-base md:text-xl italic">"{currentSentence.translation}"</p>
                )}
            </div>
        </div>
    );

    const words = result.NBest?.[0]?.Words || [];
    return (
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-2xl sm:text-3xl md:text-5xl font-black leading-relaxed">
        {words.map((word: any, index: number) => {
          const score = word.PronunciationAssessment?.AccuracyScore ?? 0;
          const errorType = word.PronunciationAssessment?.ErrorType;
          let colorClass = 'text-green-500'; 
          if (errorType === 'Omission') colorClass = 'text-slate-300 opacity-50 decoration-wavy underline decoration-red-400'; 
          else if (errorType === 'Mispronunciation') colorClass = 'text-red-500 line-through decoration-4 decoration-red-200'; 
          else if (errorType === 'Insertion') colorClass = 'text-purple-500 italic'; 
          else if (score < 80) colorClass = 'text-yellow-500'; 
          
          return (
            <span key={index} className={`relative group cursor-pointer transition-all ${colorClass}`}>
              {word.Word}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                {errorType === 'Omission' ? 'Thiếu' : errorType === 'Mispronunciation' ? 'Sai' : `${score}%`}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  const isMissingWords = calculatedMetrics.completeness < 100;

  // --- RESULT SCREEN ---
  if (lessonComplete) {
    const totalScore = lessonScores.reduce((a, b) => a + b, 0);
    const averageScore = Math.round(totalScore / sentences.length);
    const isPassed = averageScore >= 75; 

    return (
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-xl">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-[40px] shadow-2xl p-8 md:p-12 text-center border-[6px] ${isPassed ? 'bg-white border-green-100' : 'bg-white border-red-50'}`}
            >
                {/* Result Icon */}
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                    {isPassed ? <Trophy className="w-12 h-12 md:w-16 md:h-16 text-green-500 animate-bounce" /> : <Frown className="w-12 h-12 md:w-16 md:h-16 text-red-400" />}
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-2">
                    {isPassed ? "Xuất sắc!" : "Cố lên nhé!"}
                </h2>
                <p className="text-slate-500 font-medium mb-8">
                    {isPassed ? "Bạn đã hoàn thành bài học này." : "Hãy luyện tập thêm để đạt 75+ điểm."}
                </p>
                
                <div className="relative inline-block mb-10">
                    <div className={`text-7xl md:text-8xl font-black tracking-tighter ${isPassed ? 'text-green-500' : 'text-red-400'}`}>
                        {averageScore}
                    </div>
                    <span className="absolute -right-8 top-2 text-2xl font-bold text-slate-300">/100</span>
                </div>
                
                <div className="flex flex-col gap-4">
                    <button onClick={handleRestartLesson} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-3 transform active:scale-95">
                        <RotateCcw className="w-5 h-5" /> Học lại ngay
                    </button>
                    {isPassed && (
                        <button onClick={() => window.location.href = '/'} className="w-full bg-white text-slate-600 font-bold py-4 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition">
                            Quay về trang chủ
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
      </section>
    );
  }

  // --- PRACTICE SCREEN ---
  return (
    <section className="py-2">
      <div className="container mx-auto max-w-4xl">
        
        {/* Progress Bar & Header */}
        <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Trophy size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mục tiêu</span>
                    <span className="text-sm font-black text-slate-700">75/100</span>
                </div>
            </div>

            <div className="flex gap-1.5 flex-1 mx-6 md:mx-10 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                {sentences.map((_, idx) => {
                    let bgClass = 'bg-slate-200';
                    if (idx < currentIndex) bgClass = 'bg-green-500';
                    else if (idx === currentIndex) bgClass = 'bg-blue-500 animate-pulse';
                    return <div key={idx} className={`h-full rounded-full transition-all duration-500 flex-1 ${bgClass}`}></div>
                })}
            </div>

            <span className="font-black text-slate-300 text-xl">{currentIndex + 1}<span className="text-sm text-slate-200">/{sentences.length}</span></span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 relative min-h-[500px] flex flex-col">
            
            {/* Score Badge (Floating) */}
            {result && (
                <div className="absolute top-6 right-6 animate-in slide-in-from-top-4 fade-in duration-500 z-20">
                    <div className={`px-5 py-2 rounded-full border-[3px] shadow-sm flex items-center gap-2 ${displayScore >= 80 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                         <Sparkles size={16} fill="currentColor" />
                         <span className="font-black text-2xl">{displayScore}</span> 
                    </div>
                </div>
            )}

            <div className="flex-1 p-6 md:p-10 text-center flex flex-col justify-center items-center">
                
                <div className="w-full flex-1 flex flex-col justify-center">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-8 tracking-[0.2em] bg-slate-50 inline-block mx-auto px-4 py-1 rounded-full">Câu hỏi số {currentIndex + 1}</p>
                    
                    {renderHighlightedText()}
                    
                    {isMissingWords && result && (
                        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-8 inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 mx-auto">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Đừng bỏ sót từ nhé ({calculatedMetrics.completeness}%)</span>
                        </motion.div>
                    )}
                </div>

                {/* Metrics Cards Grid (Compact) */}
                <AnimatePresence>
                    {result && !isProcessing && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mt-8 mb-8 grid grid-cols-3 gap-3">
                            <div className="bg-slate-50 py-3 px-2 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Chính xác</span>
                                <span className={`text-lg font-black ${calculatedMetrics.accuracy >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{calculatedMetrics.accuracy}%</span>
                            </div>
                            <div className="bg-slate-50 py-3 px-2 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Đầy đủ</span>
                                <span className={`text-lg font-black ${calculatedMetrics.completeness === 100 ? 'text-green-600' : 'text-red-500'}`}>{calculatedMetrics.completeness}%</span>
                            </div>
                            <div className="bg-slate-50 py-3 px-2 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Trôi chảy</span>
                                <span className="text-lg font-black text-purple-500">{calculatedMetrics.fluency}%</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls Area */}
                <div className="w-full flex justify-center items-center h-28 mt-4 relative">
                    {isProcessing ? (
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-blue-50 rounded-full animate-pulse">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold mt-2 animate-pulse">AI đang chấm điểm...</p>
                        </div>
                    ) : (
                        <>
                            {!result && (
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`
                                        group relative w-20 h-20 md:w-24 md:h-24 rounded-[30px] flex items-center justify-center shadow-xl transition-all duration-300
                                        ${isRecording ? 'bg-red-500 scale-110 shadow-red-200 ring-4 ring-red-100' : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 shadow-blue-200 hover:shadow-2xl'}
                                    `}
                                >
                                    {isRecording ? (
                                        <Square className="w-8 h-8 text-white fill-current animate-pulse" />
                                    ) : (
                                        <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                                    )}
                                    {/* Pulse effect ring */}
                                    {!isRecording && <div className="absolute inset-0 rounded-[30px] border-2 border-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>}
                                </button>
                            )}

                            {result && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <button 
                                        onClick={() => { setResult(null); setIsProcessing(false); setDisplayScore(0); }}
                                        className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition active:scale-95"
                                        title="Làm lại"
                                    >
                                        <RefreshCcw className="w-6 h-6" />
                                    </button>

                                    <button 
                                        onClick={handleNextSentence}
                                        className="h-16 px-10 rounded-2xl bg-slate-900 text-white font-bold flex items-center gap-3 shadow-xl hover:bg-black hover:scale-105 transition transform active:scale-95"
                                    >
                                        <span className="text-lg">Tiếp tục</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}