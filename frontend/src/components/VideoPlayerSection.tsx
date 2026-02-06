'use client';

import { useState } from 'react';
import { Music, ChevronDown, Sparkles, ExternalLink, Star } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  category: string;
  lessonName: string;
  lyrics: string;
  buttonLink?: string;
}

const VideoPlayerSection = ({ 
  videoUrl, 
  category, 
  lessonName, 
  lyrics,
  buttonLink
}: VideoPlayerProps) => {
  const [isScriptOpen, setIsScriptOpen] = useState(true);
  const isTikTok = videoUrl?.includes('tiktok.com');

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=0`; 
    }
    if (url.includes('tiktok.com')) {
      const videoIdMatch = url.match(/video\/(\d+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (videoId) return `https://www.tiktok.com/embed/v2/${videoId}`;
      if (url.includes('/embed/')) return url;
    }
    return url; 
  };

  return (
    // THAY ĐỔI: Background Gradient Đỏ để đồng bộ trang chủ
    <section className="pt-20 pb-12 md:pt-24 md:pb-16 relative z-10 w-full bg-gradient-to-b from-[#D93838] to-[#B91C1C] overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/ME-2.jpg')] opacity-10 pointer-events-none bg-cover bg-center"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/10 animate-pulse delay-700"><Star size={40} fill="currentColor" /></div>
      <div className="absolute top-20 right-10 text-yellow-400/20 animate-bounce"><Star size={24} fill="currentColor" /></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Header Text */}
        <div className="text-center mb-6 md:mb-10 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-yellow-200 text-[10px] md:text-xs font-bold uppercase mb-4 shadow-sm">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" /> 
                <span className="tracking-wider">{category}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-md">
              {lessonName}
            </h1>
        </div>

        {/* Khung Video: Thêm viền trắng mờ sang trọng */}
        <div 
          className={`
            relative shadow-2xl mb-8 bg-black rounded-2xl md:rounded-3xl mx-auto overflow-hidden
            border-[6px] border-white/20
            ${isTikTok 
              ? 'w-full max-w-[320px] md:max-w-[340px] aspect-[9/16]'
              : 'w-full aspect-video'
            }
          `}
        >
            <iframe 
                src={getEmbedUrl(videoUrl)} 
                className="w-full h-full"
                scrolling="no" 
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                title="Video Player"
                style={{ border: 'none' }}
            />
        </div>

        {/* Nút bấm chuyển hướng: Nổi bật hơn */}
        {buttonLink && (
           <div className="flex justify-center mb-8">
              <a 
                href={buttonLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="
                  group relative inline-flex items-center justify-center gap-3 
                  px-8 py-3 md:px-10 md:py-4 text-sm md:text-base font-bold text-[#D93838] transition-all duration-300 
                  bg-white border-b-4 border-slate-200 rounded-full 
                  shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-yellow-50
                "
              >
                <span>XEM CHI TIẾT SẢN PHẨM</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
           </div>
        )}

        {/* Lyrics: Giao diện thẻ trắng sạch sẽ */}
        <div className="bg-white/95 backdrop-blur rounded-2xl md:rounded-3xl shadow-xl overflow-hidden transition-all duration-300 border border-white/20">
          <button 
            onClick={() => setIsScriptOpen(!isScriptOpen)} 
            className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition border-b border-slate-100"
          >
            <span className="text-sm md:text-base font-extrabold text-[#D93838] flex items-center gap-3 uppercase tracking-wide">
              <div className="p-1.5 bg-red-50 rounded-lg">
                <Music className="w-5 h-5 text-[#D93838]" />
              </div>
              <span>Lời bài hát / Nội dung</span>
            </span>
            <div className={`p-1 rounded-full bg-slate-100 transition-transform duration-300 ${isScriptOpen ? 'rotate-180 bg-red-100 text-[#D93838]' : ''}`}>
               <ChevronDown className="w-5 h-5" />
            </div>
          </button>
          
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isScriptOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-slate-50/50 text-sm md:text-base text-slate-700 leading-relaxed overflow-y-auto max-h-80 whitespace-pre-line font-medium custom-scrollbar">
                {lyrics || "Đang cập nhật lời bài hát..."}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoPlayerSection;