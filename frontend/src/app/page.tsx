import React from 'react';
import Link from 'next/link';
import { getLessons } from '@/lib/api'; 
import { Lock, Sparkles, Star } from 'lucide-react'; 
import TeacherAvatar from '@/components/TeacherAvatar'; 

export const dynamic = 'force-dynamic';

export default async function TetHolidayPage() {
  const lessons = await getLessons();

  const calendarConfig = [
    { date: 0, label: 'Demo' },
    { date: 11, label: 'THỨ 4' },
    { date: 12, label: 'THỨ 5' },
    { date: 13, label: 'THỨ 6' }, 
    { date: 14, label: 'THỨ 7' },
    { date: 15, label: 'CHỦ NHẬT' },
    { date: 16, label: 'THỨ 2' }, 
    { date: 17, label: 'THỨ 3' },
    { date: 18, label: 'THỨ 4' },
     { date: 19, label: 'THỨ 5' },
    { date: 20, label: 'THỨ 6' },
     { date: 21, label: 'THỨ 7' },
    { date: 22, label: 'CHỦ NHẬT' },
  ];
  const roadmapData = calendarConfig.map((dayItem) => {
    const lesson = lessons.find((l: any) => l.day === dayItem.date);
    
    const isUnlocked = lesson && lesson.isFree; 
    
    return {
      ...dayItem,
      lessonSlug: lesson?.slug,
      lessonTitle: lesson?.description,
      isLocked: !isUnlocked,
      hasLesson: !!lesson
    };
  });

  return (
    <main className="min-h-screen bg-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-[#D93838] text-white pt-12 pb-12 md:pt-16 md:pb-20 px-4 text-center relative shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/ME-1.jpg')] opacity-10 pointer-events-none bg-cover bg-center"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-black/10 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-2 animate-bounce">
             <Star className="w-4 h-4 text-yellow-100 fill-current" />
             <Star className="w-6 h-6 text-yellow-300 fill-current" />
             <Star className="w-4 h-4 text-yellow-100 fill-current" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-wide mb-2 drop-shadow-md">
            Tet Holiday 2026
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold mb-4 opacity-90 text-yellow-200">
            Song, Vocab & AI Pronunciation
          </h2>

          <p className="text-sm md:text-lg max-w-2xl leading-relaxed opacity-90 mb-8 font-medium px-2">
            Đừng để Tết làm gián đoạn hứng khởi học tập của con! <br className="hidden md:block" />
            Cùng <span className="font-bold text-yellow-300">Thầy Hoàng Đức </span> và <span className="font-bold text-yellow-300">Cô Mai Linh </span> làm chủ bộ từ vựng Tết qua 12 bài hát kinh điển.
          </p>

          <div className="flex flex-row justify-center items-start gap-6 md:gap-8 mt-4">
            
            {/* Teacher 1: Mai Linh */}
            <div className="flex flex-col items-center gap-2 scale-90 md:scale-100 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <TeacherAvatar src="/images/FD.jpg" alt="Mai Linh" />
              <div className="text-center">
                <div className="font-bold text-sm md:text-base text-yellow-100">Teacher. Mai Linh</div>
                <div className="text-[10px] tracking-widest uppercase opacity-75 bg-black/20 px-2 py-0.5 rounded-full mt-1">Founder Momtek</div>
              </div>
            </div>

            {/* Teacher 2: Hoàng Tăng Đức */}
            <div className="flex flex-col items-center gap-2 scale-90 md:scale-100 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <TeacherAvatar src="/images/FD3.jpg" alt="Hoàng Tăng Đức" />
              <div className="text-center">
                <div className="font-bold text-sm md:text-base text-yellow-100">Th. Hoàng Tăng Đức</div>
                <div className="text-[10px] tracking-widest uppercase opacity-75 bg-black/20 px-2 py-0.5 rounded-full mt-1">Founder Momtek</div>
              </div>
            </div>

          </div>
                
        </div>
      </section>

      {/* --- ROADMAP SECTION --- */}
      <section className="py-8 md:py-16 px-3 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#D93838] border border-red-100 mb-3 md:mb-4">
             <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
             <span className="text-[10px] md:text-xs font-bold uppercase">Lì xì kiến thức đầu năm</span>
          </div>
          <h3 className="text-slate-800 text-xl md:text-4xl font-black uppercase mb-2">
            Lộ trình <span className="text-[#D93838]">12 ngày</span> xuyên Tết
          </h3>
          <p className="text-slate-500 text-xs md:text-base">
            Mỗi ngày 1 bài hát và 6 từ + câu luyện âm AI
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-6">
          {roadmapData.map((day, index) => {
             const isClickable = !day.isLocked && day.lessonSlug;

             const Wrapper = isClickable ? Link : 'div';
             const wrapperProps = isClickable ? { href: `/learn/${day.lessonSlug}` } : {};

             return isClickable ? (
                <Link
                  key={index}
                  href={wrapperProps.href as string}
                  className={`
                    relative group rounded-xl md:rounded-2xl border-2 flex flex-col items-center justify-center 
                    py-4 px-2 md:py-6 md:px-2 transition-all duration-300 min-h-[100px] md:min-h-[140px]
                    cursor-pointer
                    bg-[#FFFAE8] border-[#E8D080] shadow-sm md:shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-[#D93838]
                  `}
                >
                  {day.isLocked && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 text-slate-300">
                      <Lock size={14} className="md:w-4 md:h-4" fill="currentColor" />
                    </div>
                  )}

                  <span className={`
                    text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1
                    ${day.label === 'CHỦ NHẬT' ? 'text-[#D93838]' : 'text-slate-400'}
                  `}>
                    {day.label}
                  </span>
                  <span className={`
                    text-2xl md:text-4xl font-black mb-1 md:mb-2
                    ${!day.isLocked ? 'text-slate-800' : 'text-slate-200'}
                  `}>
                    {day.date}
                  </span>

                  {day.hasLesson && (
                      <div className={`
                        text-[9px] md:text-[10px] text-center px-2 py-0.5 md:py-1 rounded-md line-clamp-1 w-full font-bold
                        ${!day.isLocked ? 'bg-[#D93838] text-white' : 'bg-slate-100 text-slate-300'}
                      `}>
                          {day.lessonTitle}
                      </div>
                  )}
                  
                  {!day.hasLesson && !day.isLocked && (
                      <span className="text-[9px] text-slate-400 italic">Trống</span>
                  )}
                </Link>
             ) : (
                <div
                  key={index}
                  className={`
                    relative group rounded-xl md:rounded-2xl border-2 flex flex-col items-center justify-center 
                    py-4 px-2 md:py-6 md:px-2 transition-all duration-300 min-h-[100px] md:min-h-[140px]
                    cursor-default
                    bg-white border-slate-100 grayscale opacity-80
                  `}
                >
                  {day.isLocked && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 text-slate-300">
                      <Lock size={14} className="md:w-4 md:h-4" fill="currentColor" />
                    </div>
                  )}

                  <span className={`
                    text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1
                    ${day.label === 'CHỦ NHẬT' ? 'text-[#D93838]' : 'text-slate-400'}
                  `}>
                    {day.label}
                  </span>

                  <span className={`
                    text-2xl md:text-4xl font-black mb-1 md:mb-2
                    ${!day.isLocked ? 'text-slate-800' : 'text-slate-200'}
                  `}>
                    {day.date}
                  </span>

                  {day.hasLesson && (
                      <div className={`
                        text-[9px] md:text-[10px] text-center px-2 py-0.5 md:py-1 rounded-md line-clamp-1 w-full font-bold
                        ${!day.isLocked ? 'bg-[#D93838] text-white' : 'bg-slate-100 text-slate-300'}
                      `}>
                          {day.lessonTitle}
                      </div>
                  )}
                  
                  {!day.hasLesson && !day.isLocked && (
                      <span className="text-[9px] text-slate-400 italic">Trống</span>
                  )}
                </div>
             );
          })}
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">
        © 2026 Momtek English. Chúc mừng năm mới! 🎆
      </footer>

    </main>
  );
}