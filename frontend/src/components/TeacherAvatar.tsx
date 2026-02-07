'use client';

import React, { useState } from 'react';
import Image from 'next/image';


interface TeacherAvatarProps {
  src?: string; 
  alt?: string; 
}

export default function TeacherAvatar({ 
  src = "/images/FD.jpg", 
  alt = "Teacher" 
}: TeacherAvatarProps) {
  
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-20 h-20 rounded-full border-4 border-yellow-200/50 overflow-hidden shadow-xl bg-white">
      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
        <span className="text-[10px] font-bold text-center px-1">{alt}</span>
      </div>
      
      {/* Chỉ hiển thị ảnh nếu chưa bị lỗi */}
      {!isError && (
        <Image 
            src={src} 
            alt={alt}
            fill
            className="object-cover"
            onError={() => setIsError(true)} 
        />
      )}
    </div>
  );
}