import { getLessonBySlug } from '@/lib/api';
import VideoPlayerSection from '@/components/VideoPlayerSection';
import PronunciationScorer from '@/components/PronunciationScorer';
import TestimonialCard from '@/components/TestimonialCard'
import Link from 'next/link';
import { ArrowLeft , BookOpen, LockKeyhole } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LearnPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const isContentLocked = !lesson.isFree;

  return (
    <main className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-red-100 selection:text-red-600">
      
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-slate-600 hover:text-[#D93838] hover:scale-105 transition-all duration-300 font-bold text-sm border border-slate-100"
          >
              <ArrowLeft className="w-5 h-5 md:mr-2" /> 
              <span className="hidden md:inline">Quay lại lộ trình</span>
          </Link>
      </div>

      {/* Phần 1: Video Player (Hero Section) */}
      <VideoPlayerSection 
        videoUrl={lesson.videoUrl}
        category={lesson.title}
        lessonName={lesson.description}
        lyrics={lesson.lyrics}
        buttonLink={lesson.buttonLink}
      />

      {/* Phần Testimonial  */}
      <div className="relative z-20 -mt-8 md:-mt-12 px-4 pb-12">
          <TestimonialCard 
  imageSrc="/images/FD1.jpg" 
  secondImageSrc="/images/FD3.jpg"
  category="HỌC MÀ CHƠI NGÀY TẾT"
  content="Kết hợp giữa Âm nhạc và công cụ luyện ngữ âm AI đến từ Microsoft sẽ giúp các con học mà chơi hiệu quả trong những ngày Tết."
/>
      </div>

      {/* --- SECTION 2: PRACTICE AREA (Floating Card Style) --- */}
      <div className="container mx-auto px-4 pb-24 relative z-20">
        
        {/* Title for Practice Section */}
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-3">
                <span className="w-12 h-1 bg-red-500 rounded-full"></span>
                Luyện tập cùng AI
                <span className="w-12 h-1 bg-red-500 rounded-full"></span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">Chấm điểm phát âm chuẩn bản xứ</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border-4 border-white ring-1 ring-slate-100 overflow-hidden relative">
          
          {/* Header Locked/Unlocked Status */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

          {/* Scorer Component Container */}
          <div className={`p-2 md:p-8 ${isContentLocked ? 'bg-slate-50 min-h-[400px] flex items-center justify-center' : 'bg-white'}`}>
             
             {isContentLocked && (
                <div className="text-center px-6">
                   <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <LockKeyhole className="w-8 h-8 text-slate-400" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-700 mb-2">Bài học bị khóa</h3>
                   <p className="text-slate-500 max-w-xs mx-auto">
                     Nội dung này dành riêng cho thành viên cao cấp. Vui lòng mở khóa để tiếp tục.
                   </p>
                </div>
             )}
             
             {/* Component chấm điểm - Làm mờ nếu bị khóa */}
             <div className={isContentLocked ? 'opacity-0 pointer-events-none absolute inset-0' : ''}>
                <PronunciationScorer 
                  sentences={lesson.content} 
                  isLocked={isContentLocked}
                />
             </div>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">
        © 2026 Momtek English. Chúc mừng năm mới! 🎆
      </footer>
    </main>
  );
}