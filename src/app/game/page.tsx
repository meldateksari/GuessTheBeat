"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SpotifyService } from '@/services/spotify';
import { DeezerService } from '@/services/deezer';
import { getRandomSongFromPlaylists } from '@/utils/spotify';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playlistleri getir
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken) return;

      try {
        const playlistData = await SpotifyService.getUserPlaylists(session.accessToken);
        setPlaylists(playlistData);
        setIsLoading(false);
      } catch (error) {
        console.error('Playlistler getirilirken hata oluştu:', error);
        setError(error instanceof Error ? error.message : 'Playlistler yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchPlaylists();
    }
  }, [session]);

  // Rastgele şarkı seç ve oynat
  const getAndPlayRandomSong = async () => {
    if (!session?.accessToken) return;

    try {
      setIsLoading(true);
      // Spotify'dan rastgele şarkı adı al
      const songName = await getRandomSongFromPlaylists(session.accessToken);
      setCurrentSongName(songName);
      
      // Deezer'dan şarkı URL'ini al
      const previewUrl = await DeezerService.searchTrack(songName);
      
      if (previewUrl) {
        setCurrentSongUrl(previewUrl);
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        throw new Error('Şarkı önizlemesi bulunamadı');
      }
    } catch (error) {
      console.error('Şarkı yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Şarkı yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Oturum kontrolü
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1D14] text-white">
        <div className="text-xl">Yükleniyor...</div>
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
    <div className="flex min-h-screen bg-[#0A1D14] text-white">
      {/* Playlist Sidebar */}
      <div className="w-80 bg-[#0D2318] p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Playlistleriniz</h2>
        <div className="space-y-2">
          {playlists && playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                selectedPlaylist === playlist.id ? 'bg-[#4CAF50]' : 'hover:bg-[#1E3A2B]'
              }`}
            >
              {playlist.images[0] && (
                <Image
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  width={48}
                  height={48}
                  className="rounded mr-3"
                />
              )}
              <div className="text-left">
                <div className="font-medium truncate">{playlist.name}</div>
                <div className="text-sm text-gray-400">{playlist.tracks.total} şarkı</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Şarkı Tahmin Oyunu</h1>
          <p className="text-xl text-gray-400 mb-8">
            Başla butonuna tıklayarak rastgele bir şarkı dinleyin ve tahmin edin!
          </p>
          <button 
            onClick={getAndPlayRandomSong}
            className="bg-[#4CAF50] text-white px-8 py-4 rounded-lg text-xl hover:bg-[#45A049] mb-4"
          >
            {currentSongUrl ? 'Sonraki Şarkı' : 'Başla'}
          </button>

          {/* Song Info & Audio Player */}
          {currentSongUrl && (
            <div className="mt-8 space-y-4">
              <div className="text-xl font-semibold text-[#4CAF50]">
                Seçilen Şarkı: {currentSongName}
              </div>
              <audio
                ref={audioRef}
                src={currentSongUrl}
                controls
                className="w-full max-w-md"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 