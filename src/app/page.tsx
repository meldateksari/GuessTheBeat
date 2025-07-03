"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSpotifyLogin = async () => {
    try {
      await signIn('spotify', { 
        callbackUrl: '/game',
        redirect: true
      });
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  // Eğer oturum varsa otomatik olarak oyun sayfasına yönlendir
  if (status === "authenticated" && session?.accessToken) {
    router.push('/game');
    return null;
  }

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
            <button
              onClick={handleSpotifyLogin}
              className="w-full py-3 px-6 bg-[#1E3A2B] rounded-full hover:bg-[#2A4D39] transition-colors text-center"
            >
              {status === "loading" ? "Yükleniyor..." : "Connect with Spotify"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
