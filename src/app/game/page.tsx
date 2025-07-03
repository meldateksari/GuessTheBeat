"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();

  const handleSubmitGuess = () => {
    router.push('/game/result');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1D14] text-white p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Album Cover */}
        <div className="w-64 h-64 bg-[#1E3A2B] rounded-lg mb-6 overflow-hidden">
          <Image
            src="/placeholder-album.jpg"
            alt="Hidden Album Cover"
            width={256}
            height={256}
            className="object-cover"
          />
        </div>

        {/* Song Title */}
        <h2 className="text-2xl font-bold mb-2">Hidden Melody</h2>
        <p className="text-gray-400 mb-8">Voice Sample</p>

        {/* Progress Bar */}
        <div className="w-full bg-[#1E3A2B] rounded-full h-1 mb-4">
          <div className="bg-[#4CAF50] h-1 rounded-full" style={{ width: '45%' }}></div>
        </div>
        
        {/* Time */}
        <div className="w-full flex justify-between text-sm mb-8">
          <span>1:17</span>
          <span>2:23</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button className="text-white hover:text-[#4CAF50]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-white hover:text-[#4CAF50]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="bg-[#4CAF50] rounded-full p-4 hover:bg-[#45A049]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="text-white hover:text-[#4CAF50]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="text-white hover:text-[#4CAF50]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Skip Button */}
        <button className="bg-[#1E3A2B] text-white px-6 py-2 rounded-full hover:bg-[#2A4D39] mb-8">
          Skip
        </button>

        {/* Guess Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Type your guess..."
            className="w-full bg-[#1E3A2B] text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
          <button 
            onClick={handleSubmitGuess}
            className="w-full bg-[#4CAF50] text-white py-3 rounded-lg hover:bg-[#45A049]"
          >
            Submit Guess
          </button>
        </div>
      </div>
    </div>
  );
} 