'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function NotFoundPage() {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/404.json'
      });

      return () => {
        animation.destroy();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0A1D14] to-[#0F2A1D] text-white/90 p-4 overflow-hidden">
      <div className="text-center max-w-4xl w-full flex flex-col items-center justify-center h-full">
        {/* Lottie Animation */}
        <div 
          ref={animationContainer}
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto mb-4 sm:mb-6 flex-shrink-0"
        />
        
        {/* Error Message */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
            404
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 sm:mb-6">
            Sayfa Bulunamadı
          </h2>
          
          {/* Back to Home Button */}
          <button
            onClick={() => window.history.back()}
            className="bg-emerald-500/10 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-light tracking-wide hover:bg-emerald-500/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
} 