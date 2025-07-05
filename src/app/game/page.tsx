"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotifyService } from '@/services/spotify';
import { DeezerService } from '@/services/deezer';
import { getRandomSongFromPlaylists } from '@/utils/spotify';
import WinScreen from '@/components/WinScreen';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

interface DeezerTrack {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  preview: string;
}

// Dinleme süreleri (saniye cinsinden)
const LISTENING_STAGES = [0.5, 1, 3, 5, 10, 15];

export default function GamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
  const [currentSongName, setCurrentSongName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState('');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [searchResults, setSearchResults] = useState<DeezerTrack[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [guessTime, setGuessTime] = useState(LISTENING_STAGES[0]);

  // Deezer'dan şarkı arama fonksiyonu
  const searchDeezerTracks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const tracks = await DeezerService.searchTrack(query);
      setSearchResults(tracks.slice(0, 6)); // Maksimum 6 sonuç
      setShowDropdown(true);
    } catch (error) {
      console.error('Deezer arama hatası:', error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Input değişikliğini handle et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuess(value);

    // Önceki timeout'u temizle
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // 0.5 saniye sonra aramayı yap
    const newTimeout = setTimeout(() => {
      searchDeezerTracks(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Dropdown'dan şarkı seçimi
  const handleSongSelect = (track: DeezerTrack) => {
    setGuess(`${track.title} - ${track.artist.name}`);
    setShowDropdown(false);
    // Form submit işlemi kaldırıldı - kullanıcı manuel olarak Tahmin Et butonuna tıklayacak
  };

  // Playlistleri getir
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken) return;

      try {
        const playlistData = await SpotifyService.getUserPlaylists(session.accessToken);
        setPlaylists(playlistData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while loading playlists');
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchPlaylists();
    }
  }, [session]);

  // Oturum kontrolü
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  // Şarkıyı çal
  const playSongSegment = (duration: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, duration * 1000);
  };

  // Yeni şarkı başlatıldığında
  const startNewSong = async () => {
    if (!session?.accessToken) return;

    try {
      setIsLoading(true);
      setShowAnswer(false);
      setCurrentStageIndex(0);
      setGuess('');
      setGameStarted(true);
      
      // Get random song from Spotify
      const songName = await getRandomSongFromPlaylists(session.accessToken);
      setCurrentSongName(songName);
      
      // Get song URL from Deezer
      const previewUrl = await DeezerService.searchTrack(songName);
      
      if (previewUrl && previewUrl.length > 0) {
        setCurrentSongUrl(previewUrl[0].preview);
        // Start first stage automatically
        setTimeout(() => {
          playSongSegment(LISTENING_STAGES[0]);
        }, 500);
      } else {
        throw new Error('Şarkı önizlemesi bulunamadı');
      }
    } catch (error) {
      console.error('Error loading song:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while loading the song');
    } finally {
      setIsLoading(false);
    }
  };

  // Sonraki aşamaya geç
  const handleSkip = () => {
    if (!audioRef.current || currentStageIndex >= LISTENING_STAGES.length - 1) return;
    
    const nextStageIndex = currentStageIndex + 1;
    setCurrentStageIndex(nextStageIndex);
    playSongSegment(LISTENING_STAGES[nextStageIndex]);
    setGuessTime(LISTENING_STAGES[nextStageIndex]);
  };

  // Tahmini kontrol et
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSongName || !guess) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedSongName = currentSongName.toLowerCase().trim();

    // Basit benzerlik kontrolü
    const isCorrect = normalizedSongName.includes(normalizedGuess) || 
                     normalizedGuess.includes(normalizedSongName);

    if (isCorrect) {

      // Puan hesaplama
      const currentStagePoints = LISTENING_STAGES.length - currentStageIndex;
      const earnedPoints = currentStagePoints * 100;
      setScore(prevScore => prevScore + earnedPoints);
      
      // Win screen'i göster
      setShowWinScreen(true);
    }
  };

  // Yeni oyun başlat
  const handleNextSong = () => {
    setShowWinScreen(false);
    startNewSong();
  };

  // Paylaşım fonksiyonu
  const handleShare = () => {
    // Paylaşım mantığı buraya gelecek
    console.log('Share clicked');
  };

  // Audio element için event listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1D14] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1D14] text-white">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-screen bg-gradient-to-b from-[#0A1D14] to-[#0F2A1D] text-white/90 overflow-hidden"
      whileHover={{
        background: "linear-gradient(to bottom, #0C2218, #133524)",
        transition: { duration: 0.6 }
      }}
    >
      {/* Playlist Sidebar */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-80 bg-black/20 backdrop-blur-lg p-6 overflow-y-auto border-r border-white/5 h-screen"
      >
        <motion.h2 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-light tracking-wide mb-6 text-emerald-400"
        >
          Çalma Listelerim
        </motion.h2>
        <div className="space-y-3">
          {playlists && playlists.map((playlist) => (
            <motion.button
              key={playlist.id}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(76, 175, 80, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlaylist(playlist.id)}
              className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 ${
                selectedPlaylist === playlist.id ? 'bg-emerald-500/20 border border-emerald-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {playlist.images[0] && (
                <Image
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  width={48}
                  height={48}
                  className="rounded-lg mr-4"
                />
              )}
              <div className="text-left">
                <div className="font-light tracking-wide text-white/90">{playlist.name}</div>
                <div className="text-sm text-white/50">{playlist.tracks.total} şarkı</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex flex-col items-center p-8 h-screen overflow-hidden relative"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-xl w-full mt-16"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-light tracking-wide mb-4"
          >
            <span className="font-semibold text-emerald-400">Şarkıyı</span> Tahmin Et
          </motion.h1>

          {/* Score Display - Yeni konum */}
          <AnimatePresence>
            {gameStarted && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 text-center"
              >
                <div className="text-lg font-semibold">
                  Skor: <span className="text-emerald-400 font-bold">{score}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          

          {!gameStarted && (
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(76, 175, 80, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewSong}
            className="bg-emerald-500/20 text-white/90 px-10 py-4 rounded-xl text-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 mb-8 font-light tracking-wide shadow-lg shadow-emerald-500/10"
          >
            Başla
          </motion.button>
          )}
          {/* Song Info & Audio Player */}
          <AnimatePresence>
            {currentSongUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 space-y-4 backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl shadow-emerald-500/5"
              >
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(currentStageIndex + 1) * (100 / LISTENING_STAGES.length)}%` 
                    }}
                    transition={{ duration: 0.5 }}
                    className="bg-emerald-500/50 h-2 rounded-full"
                  />
                </div>

                {/* Current Stage Info */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base font-light text-emerald-400/90 mb-6 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dinleme süresi: {LISTENING_STAGES[currentStageIndex]} saniye
                </motion.div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(76, 175, 80, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playSongSegment(LISTENING_STAGES[currentStageIndex])}
                  disabled={isPlaying}
                  className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isPlaying 
                      ? 'bg-emerald-500/20 cursor-not-allowed' 
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 hover:border-emerald-500/50'
                  } border-2 border-emerald-500/30 mx-auto mb-4`}
                >
                  {isPlaying ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-8 bg-emerald-400 rounded-full mx-0.5"
                      />
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.2,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-8 bg-emerald-400 rounded-full mx-0.5"
                      />
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.4,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-8 bg-emerald-400 rounded-full mx-0.5"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative w-8 h-8"
                    >
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-8 h-8 text-emerald-400"
                        whileHover={{ scale: 1.1 }}
                      >
                        <path d="M8 5v14l11-7z"/>
                      </motion.svg>
                    </motion.div>
                  )}
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-emerald-500/20 z-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/60 text-sm mb-4"
                >
                  {isPlaying ? 'Oynatılıyor...' : 'Dinlemek için tıkla'}
                </motion.div>

                {/* Skip Button */}
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(44, 95, 45, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkip}
                  disabled={currentStageIndex >= LISTENING_STAGES.length - 1 || isPlaying}
                  className={`w-full bg-[#2C5F2D]/20 text-white/90 px-6 py-3 rounded-xl mb-4 text-sm border border-[#2C5F2D]/30 transition-all duration-300 ${
                    (currentStageIndex >= LISTENING_STAGES.length - 1 || isPlaying)
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:border-[#2C5F2D]/50'
                  }`}
                >
                  {isPlaying 
                    ? 'Şarkı Çalınıyor...' 
                    : `Daha Uzun Dinle (${LISTENING_STAGES[currentStageIndex + 1]} saniye)`
                  }
                </motion.button>

                {/* Guess Input Form */}
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleGuessSubmit} 
                  className="flex flex-col items-center gap-3 mb-4"
                >
                  <div className="relative w-full">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={guess}
                      onChange={handleInputChange}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Şarkı adını tahmin et..."
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-emerald-500/30 text-white/90 focus:border-emerald-500/50 focus:outline-none transition-all duration-300 font-light text-sm"
                    />
                    <AnimatePresence>
                      {showDropdown && searchResults.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-10 w-full bottom-[calc(100%+4px)] bg-[#0A1D14]/95 backdrop-blur-lg border border-emerald-500/30 rounded-xl shadow-lg"
                        >
                          <div className="flex flex-col w-full">
                            {searchResults.map((track) => (
                              <motion.div
                                key={track.id}
                                whileHover={{ backgroundColor: "rgba(76, 175, 80, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSongSelect(track);
                                }}
                                className="w-full text-left px-4 py-2.5 text-white/90 hover:bg-emerald-500/20 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl border-b border-emerald-500/10 last:border-b-0 cursor-pointer text-sm"
                              >
                                <div className="font-light truncate">{track.title} - {track.artist.name}</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(76, 175, 80, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-emerald-500/20 text-white/90 px-6 py-2 rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 font-light tracking-wide text-sm"
                  >
                    Tahmin Et
                  </motion.button>
                </motion.form>

                {/* Show Answer */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-lg font-light tracking-wide text-emerald-400/90 mb-2"
                    >
                      Doğru Cevap: {currentSongName}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={currentSongUrl}
                  className="hidden"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showWinScreen && currentSongName && (
          <WinScreen
            songName={currentSongName.split(' - ')[0]}
            artistName={currentSongName.split(' - ')[1]}
            guessTime={guessTime}
            onNextSong={handleNextSong}
            onShare={handleShare}
            onBack={() => setShowWinScreen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
} 