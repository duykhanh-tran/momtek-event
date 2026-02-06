'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function TeacherAvatar() {
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-20 h-20 rounded-full border-4 border-yellow-200/50 overflow-hidden shadow-xl bg-white">
      {/* Fallback background (hiện khi ảnh lỗi hoặc đang load) */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
        <span className="text-xs">IMG</span>
      </div>
      
      {/* Chỉ hiển thị ảnh nếu chưa bị lỗi */}
      {!isError && (
        <Image 
            src="/images/FD.jpg" 
            alt="Teacher Mai Linh"
            fill
            className="object-cover"
            onError={() => setIsError(true)} // Client Component xử lý được event này
        />
      )}
    </div>
  );
}