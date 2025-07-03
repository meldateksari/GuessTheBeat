"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1D14] text-white p-4 pt-20">
        <div className="flex flex-col items-center max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4">Feel the Music, Make Your Guess!</h1>
          <p className="text-lg mb-8">
            Test your music knowledge with BeatGuess! Listen to the beats of songs and try to guess them. 
            Compete with your friends and climb to the top of the leaderboard.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Link 
              href="/game"
              className="w-full py-3 px-6 bg-[#1E3A2B] rounded-full hover:bg-[#2A4D39] transition-colors text-center"
            >
              Connect with Spotify
            </Link>
            
            <Link 
              href="/game"
              className="w-full py-3 px-6 bg-[#4CAF50] rounded-full hover:bg-[#45A049] transition-colors text-center"
            >
              Start Game
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
