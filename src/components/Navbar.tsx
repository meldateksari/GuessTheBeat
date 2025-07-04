"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';


export default function Navbar() {
  const { data: session } = useSession();

  const handleSpotifyLogin = async () => {
    try {
      await signIn('spotify', { 
        callbackUrl: '/game',
        redirect: true
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed top-0 left-0 right-0 bg-[#0A1D14]/95 backdrop-blur-sm text-white/90 py-4 px-6 flex justify-between items-center z-50 shadow-lg"
    >
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
      >
        <Link href="/" className="text-2xl font-light tracking-wide">
          <span className="font-semibold text-emerald-400">Beat</span>Guess
        </Link>
      </motion.div>
      
      <div className="flex items-center gap-8">
        <motion.div className="hidden md:flex items-center gap-8 text-sm font-light">
          <Link href="/how-to-play" className="hover:text-emerald-400 transition-colors duration-200">
            Nasıl Oynanır
          </Link>
          <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors duration-200">
            Sıralama
          </Link>
          {session ? (
            <>
              <Link href="/profile" className="hover:text-emerald-400 transition-colors duration-200">
                Profil
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Çıkış Yap
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpotifyLogin}
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-200"
              >
                <span>Giriş Yap</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </motion.button>
            </>
          )}
        </motion.div>

        {session && (
          <motion.div 
            className="w-8 h-8 rounded-full bg-emerald-800/30 overflow-hidden flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-emerald-400">
                {session.user?.name?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
} 