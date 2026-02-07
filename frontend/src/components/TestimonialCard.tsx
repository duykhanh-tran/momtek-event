import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  imageSrc: string;
  category?: string;
  content: string;
  // --- Thay thế các props cứng bằng children để linh hoạt ---
  children?: React.ReactNode; 
  // --- Props cho người thứ 2 (Tùy chọn) ---
  secondImageSrc?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  imageSrc,
  category = "HỌC MÀ CHƠI NGÀY TẾT",
  content,
  children, // Nhận nội dung tùy biến từ bên ngoài (Tên, chức vụ...)
  secondImageSrc,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-0 md:px-4">
      <div className="relative bg-[#1e293b] rounded-[30px] md:rounded-[40px] p-8 md:p-10 flex flex-col items-center text-center gap-6 shadow-2xl overflow-hidden border border-yellow-500/10">
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D93838]/20 rounded-full blur-3xl -z-0 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -z-0 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

        {/* --- KHU VỰC ẢNH (1 HOẶC 2 NGƯỜI) --- */}
        <div className="relative z-10 flex flex-row gap-6 md:gap-10 justify-center items-center mt-2">
            
            {/* Người 1 */}
            <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full border-[3px] border-yellow-200/30 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 bg-white/5">
                <Image
                    src={imageSrc}
                    alt="Author 1"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Người 2 (Chỉ hiện nếu có) */}
            {secondImageSrc && (
                <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full border-[3px] border-yellow-200/30 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 bg-white/5">
                    <Image
                        src={secondImageSrc}
                        alt="Author 2"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            )}
        </div>

        {/* --- KHU VỰC NỘI DUNG --- */}
        <div className="relative z-10 flex flex-col items-center flex-1 w-full">
          
          {/* Header */}
          <div className="mb-4">
            <span className="text-yellow-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase border-b border-yellow-400/30 pb-1">
              {category}
            </span>
          </div>

          {/* Main Content */}
          <p className="text-slate-200 text-base md:text-xl font-medium leading-relaxed mb-8 italic max-w-2xl">
            "{content}"
          </p>

          {/* Footer Area (Tên tác giả, chức vụ...) - Render từ Children */}
          <div className="mt-auto border-t border-white/10 pt-6 w-full">
             {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;