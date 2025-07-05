"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../../../public/animation.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SecretPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Yazı görünür (otomatik olarak başlar)
    
    // 2. Yazı yukarı hareket eder (2 saniye sonra)
    const moveUpTimer = setTimeout(() => {
      setMoveUp(true);
    }, 2000);

    // 3. Lottie animasyonu başlar (3.5 saniye sonra)
    const showLottieTimer = setTimeout(() => {
      setShowAnimation(true);
    }, 3500);

    return () => {
      clearTimeout(moveUpTimer);
      clearTimeout(showLottieTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1D14] to-[#0F2A1D] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Ana Sayfa Butonu */}
      <motion.button
        onClick={() => router.push("/")}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 px-6 py-3 bg-emerald-500/20 rounded-full 
                 hover:bg-emerald-500/30 text-emerald-300 font-medium z-20 overflow-hidden group text-sm md:text-base
                 border border-emerald-500/30 backdrop-blur-sm shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          transition: {
            delay: 3.5,
            duration: 0.5
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfa
        </span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.button>

      {/* Ana Başlık */}
      <div className="w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: 1,
            y: moveUp ? "-30vh" : 0,
            transition: {
              opacity: { duration: 0.8 },
              y: { duration: 1, ease: "easeInOut" }
            }
          }}
          className="text-center px-4"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-light text-emerald-400 tracking-wide"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.8
              }
            }}
            whileHover={{
              textShadow: "0 0 15px rgba(52, 211, 153, 0.7)",
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.4
                }
              }}
              className="font-medium"
            >
              Meldaa
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.4
                }
              }}
              className="font-medium"
            >
              ve
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 0.8,
                  duration: 0.4
                }
              }}
              className="font-medium"
            >
              Enes
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 1.2,
                  duration: 0.4
                }
              }}
              className="tracking-wider font-medium"
            >
              tarafından yapıldı
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  delay: 1.6,
                  duration: 0.4
                }
              }}
              className="tracking-wider font-medium text-emerald-300"
            >
              {" "}:)
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Lottie Animasyonu */}
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 1
              }
            }}
            className="w-full max-w-[280px] sm:max-w-md md:max-w-2xl lg:max-w-3xl absolute top-[60%] left-1/2 transform 
                     -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <Lottie animationData={animationData} loop={true} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
