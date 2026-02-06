import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  imageSrc: string;
  category?: string;
  content: string;
  authorName: string;
  authorRole: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  imageSrc,
  category = "HỌC MÀ CHƠI NGÀY TẾT",
  content,
  authorName,
  authorRole,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-0 md:px-4">
      <div className="relative bg-[#1e293b] rounded-[30px] md:rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl overflow-hidden border border-yellow-500/10">
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D93838]/20 rounded-full blur-3xl -z-0 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -z-0 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

        {/* Avatar Image */}
        <div className="relative z-10 flex-shrink-0 group">
          <div className="w-28 h-28 md:w-36 md:h-36 relative rounded-full border-[3px] border-yellow-200/30 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image
              src={imageSrc}
              alt={authorName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[#1e293b] text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            Teacher
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex flex-col text-center md:text-left flex-1">
          
          {/* Header */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="text-yellow-400 text-xs md:text-sm font-bold tracking-[0.2em] uppercase border-b border-yellow-400/30 pb-1">
              {category}
            </span>
          </div>

          {/* Main Content */}
          <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed mb-6 italic">
            "{content}"
          </p>

          {/* Author Signature */}
          <div className="mt-auto">
            <h4 className="text-white font-bold text-lg">
              {authorName}
            </h4>
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mt-1">
              {authorRole}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;