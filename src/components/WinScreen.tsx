import { motion } from 'framer-motion';

interface WinScreenProps {
  songName: string;
  artistName: string;
  guessTime: number;
  onNextSong: () => void;
  onShare: () => void;
  onBack: () => void;
}

export default function WinScreen({ songName, artistName, guessTime, onNextSong, onShare, onBack }: WinScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-[#0A1D14] w-full max-w-md border border-emerald-500/30"
      >
        {/* Başlık */}
        <motion.div 
          initial={{ backgroundColor: "#065F46", y: -50 }}
          animate={{ y: 0 }}
          className="bg-emerald-700 py-4 md:py-6 text-center border-b border-emerald-600"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-emerald-50">Doğru!</h2>
        </motion.div>

        {/* İçerik */}
        <div className="p-6 md:p-8 text-center text-white">
          <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-emerald-400">{songName}</h3>
          <p className="text-lg md:text-2xl text-white/80 mb-8 md:mb-12">{artistName}</p>

          <div className="mb-8 md:mb-12">
            <p className="text-base md:text-xl mb-2 text-emerald-200/80">Şarkıyı başarıyla tahmin ettin</p>
            <p className="text-3xl md:text-5xl font-bold text-emerald-400">{guessTime.toFixed(1)} <span className="text-xl md:text-2xl font-normal text-emerald-400/70">saniye</span></p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2 md:gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#064E3B" }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-emerald-900 text-emerald-50 p-3 md:p-4 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#064E3B" }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="bg-emerald-700 text-emerald-50 px-6 md:px-12 py-3 md:py-4 font-medium flex-1 transition-colors text-sm md:text-base"
            >
              PAYLAŞ
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#064E3B" }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextSong}
              className="bg-emerald-700 text-emerald-50 px-6 md:px-12 py-3 md:py-4 font-medium flex-1 transition-colors text-sm md:text-base"
            >
              SONRAKİ
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 