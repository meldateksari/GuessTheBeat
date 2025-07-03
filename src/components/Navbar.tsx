"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0A1D14] text-white p-4 flex justify-between items-center z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold">
          ▲ BeatGuess
        </Link>
      </div>
      
      <div className="flex items-center gap-6">
        <Link href="/how-to-play" className="hover:text-gray-300">
          How to Play
        </Link>
        <Link href="/leaderboard" className="hover:text-gray-300">
          Leaderboard
        </Link>
        {session ? (
          <>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
            <button
              onClick={() => signOut()}
              className="hover:text-gray-300"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/" className="hover:text-gray-300">
            Sign In
          </Link>
        )}
        <button className="p-2 hover:bg-[#1E3A2B] rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.109.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
          <Image
            src="/default-avatar.png"
            alt="Profile"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      </div>
    </nav>
  );
} 