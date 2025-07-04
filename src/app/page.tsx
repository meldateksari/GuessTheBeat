"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrollCount, setScrollCount] = useState(0);
  const lastScrollTime = useRef<number>(0);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY < 0) { // Yukarı scroll
        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollTime.current;

        // İlk scroll veya son scroll'dan 2 saniye geçtiyse
        if (scrollCount === 0 || timeSinceLastScroll >= 2000) {
          // Sayacı artır ve konsola yazdır
          setScrollCount(prev => {
            const newCount = prev + 1;
            return newCount;
          });

          // Son scroll zamanını güncelle
          lastScrollTime.current = now;

          // 5 saniye sonra sayacı sıfırlayacak zamanlayıcıyı ayarla
          if (resetTimeout.current) {
            clearTimeout(resetTimeout.current);
          }
          resetTimeout.current = setTimeout(() => {
            setScrollCount(0);
          }, 5000);

          // Eğer 3. scroll'a ulaşıldıysa
          if (scrollCount === 2) {
            router.push('/keepshining');
            setScrollCount(0);
            if (resetTimeout.current) {
              clearTimeout(resetTimeout.current);
            }
          }
        }
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
    };
  }, [scrollCount, router]);

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

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4
      }
    }
  };

  const childVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0A1D14] to-[#0F2A1D] text-white/90 p-4 pt-20"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          whileHover={{
            background: "linear-gradient(to bottom, #0C2218, #133524)",
            transition: { duration: 0.6 }
          }}
        >
          <motion.div 
            className="flex flex-col items-center max-w-2xl text-center space-y-8"
            variants={childVariants}
          >
            <motion.div variants={childVariants} className="space-y-4">
              <motion.h1 
                className="text-5xl font-light tracking-wide mb-2"
                variants={childVariants}
              >
                <span className="font-semibold text-emerald-400">Feel</span> the Music,
                <br />
                Make Your <span className="font-light">Guess</span>!
              </motion.h1>
              <motion.p 
                className="text-lg font-light text-white/80 leading-relaxed max-w-xl mx-auto"
                variants={childVariants}
              >
                Test your music knowledge with BeatGuess! Listen to the beats and make your predictions. 
                Compete with friends and climb to the top of the leaderboard.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-4 w-full max-w-xs"
              variants={childVariants}
            >
              {session ? (
                <Link href="/game" className="group relative w-full py-4 px-6 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all duration-300 text-center overflow-hidden">
                <span className="relative z-10 font-light tracking-wide flex items-center justify-center gap-2">
                  Oyuna Geç
                </span>
                </Link>
              ):(
              <motion.button
                onClick={handleSpotifyLogin}
                className="group relative w-full py-4 px-6 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all duration-300 text-center overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 font-light tracking-wide flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    "Loading..."
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Connect with Spotify
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-400/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
