"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen }: NavbarProps) {
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

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.2
      }
    },
    open: {
      x: "0%",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed top-0 left-0 right-0 bg-[#0A1D14]/95 backdrop-blur-sm text-white/90 py-4 px-6 flex justify-between items-center z-50 shadow-lg"
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
      >
        <Link href="/" className="text-2xl font-light tracking-wide">
          <span className="text-white">Guess</span>
          <span className="text-emerald-400">The</span>
          <span className="text-white">Beat</span>
        </Link>
      </motion.div>

      {/* Desktop Menu Items */}
      <div className="hidden lg:flex items-center gap-8">
        <Link 
          href="/how-to-play" 
          className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Nasıl Oynanır</span>
        </Link>
        
        <Link 
          href="/leaderboard" 
          className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Sıralama</span>
        </Link>

        {/* Desktop Profile/Login Section */}
        {session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-800/30 overflow-hidden flex items-center justify-center ring-2 ring-emerald-500/20">
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
              </div>
              <span className="text-sm text-white/90">{session.user?.name}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 hover:bg-rose-500/10 rounded-lg transition-all duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-400/70 group-hover:text-rose-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Çıkış</span>
            </motion.button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpotifyLogin}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="text-white/90 group-hover:text-white transition-colors duration-200">Spotify ile Giriş</span>
          </motion.button>
        )}
      </div>

      {/* Mobile Hamburger Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white/90 z-50 lg:hidden"
      >
        <div className="flex flex-col gap-1.5">
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} 
            className="w-6 h-0.5 bg-current block transition-transform"
          />
          <motion.span 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} 
            className="w-6 h-0.5 bg-current block"
          />
          <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} 
            className="w-6 h-0.5 bg-current block transition-transform"
          />
        </div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 cursor-pointer lg:hidden"
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-screen w-72 bg-gradient-to-b from-[#0A1D14] to-[#0F2A1D] shadow-2xl p-8 z-40 flex flex-col lg:hidden"
            >
              {/* Mobile Profile Section */}
              {session && (
                <div className="flex items-center gap-4 mb-8 pt-14 border-b border-white/10 pb-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-800/30 overflow-hidden flex items-center justify-center ring-2 ring-emerald-500/20">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-emerald-400">
                        {session.user?.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-medium text-white/90">{session.user?.name}</p>
                    <p className="text-sm text-emerald-400/80">@{session.user?.email?.split('@')[0]}</p>
                  </div>
                </div>
              )}

              {/* Mobile Menu Items */}
              <div className="flex flex-col gap-1">
                <Link 
                  href="/how-to-play" 
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Nasıl Oynanır</span>
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400/70 group-hover:text-emerald-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Sıralama</span>
                </Link>
                {session ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 rounded-lg transition-all duration-200 group text-left mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-400/70 group-hover:text-rose-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">Çıkış Yap</span>
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      handleSpotifyLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 group mt-2"
                  >
                    <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span className="text-white/90 group-hover:text-white transition-colors duration-200">Spotify ile Giriş Yap</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 