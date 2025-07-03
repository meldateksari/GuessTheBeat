"use client";

import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function GameResult() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-[#0A1D14] text-white p-4 pt-20">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Game Over</h1>
          
          {/* Correct Guesses */}
          <div className="bg-[#1E3A2B] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Correct Guesses</h2>
            <div className="text-3xl font-bold text-[#4CAF50]">7/10</div>
          </div>

          {/* Wrong Guesses */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Wrong Guesses</h2>
            
            <div className="space-y-4">
              <div className="bg-[#1E3A2B] rounded-lg p-4">
                <p className="text-gray-300 mb-1">Your Guess: "Skyface"</p>
                <p className="text-[#4CAF50]">Correct Answer: "Starlight"</p>
              </div>

              <div className="bg-[#1E3A2B] rounded-lg p-4">
                <p className="text-gray-300 mb-1">Your Guess: "Nightfall"</p>
                <p className="text-[#4CAF50]">Correct Answer: "Sunset"</p>
              </div>

              <div className="bg-[#1E3A2B] rounded-lg p-4">
                <p className="text-gray-300 mb-1">Your Guess: "Storm"</p>
                <p className="text-[#4CAF50]">Correct Answer: "Wind"</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              href="/game"
              className="flex-1 py-3 px-6 bg-[#4CAF50] rounded-full hover:bg-[#45A049] transition-colors text-center"
            >
              Play Again
            </Link>
            <Link 
              href="/"
              className="flex-1 py-3 px-6 bg-[#1E3A2B] rounded-full hover:bg-[#2A4D39] transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 