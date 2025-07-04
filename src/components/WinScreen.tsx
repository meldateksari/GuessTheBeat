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
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-[#3C3C3C] rounded-3xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Başlık */}
        <motion.div 
          initial={{ backgroundColor: "#4CAF50", y: -50 }}
          animate={{ y: 0 }}
          className="bg-[#4CAF50] py-6 text-center"
        >
          <h2 className="text-white text-3xl font-semibold">Kazandın!</h2>
        </motion.div>

        {/* İçerik */}
        <div className="p-8 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">{songName}</h3>
          <p className="text-2xl text-white/80 mb-12">{artistName}</p>

          <div className="mb-12">
            <p className="text-xl mb-2">Şarkıyı başarıyla tahmin ettin</p>
            <p className="text-5xl font-bold">{guessTime.toFixed(1)} saniye</p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-[#4CAF50]/20 hover:bg-[#4CAF50]/30 text-white p-4 rounded-xl flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-12 py-4 rounded-xl font-semibold flex-1"
            >
              PAYLAŞ
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextSong}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-12 py-4 rounded-xl font-semibold flex-1"
            >
              SONRAKİ
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 