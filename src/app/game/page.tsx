"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SpotifyWebApi from 'spotify-web-api-node';
import { useSession, signIn } from 'next-auth/react';

// Spotify Player tiplerini tanımla
declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// Spotify API istemcisini oluştur
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface PlayerState {
  track_window: {
    current_track: {
      album: {
        images: { url: string }[];
      };
    };
  };
  paused: boolean;
  position: number;
  duration: number;
}

export default function GamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [player, setPlayer] = useState<any>(null);
  const [is_paused, setPaused] = useState(false);
  const [current_track, setTrack] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializePlayback = async (device_id: string, retryCount = 0) => {
    try {
      const playlistsResponse = await spotifyApi.getUserPlaylists({ limit: 50 });
      
      if (!playlistsResponse.body.items.length) {
        throw new Error("Kullanıcının playlist'i bulunamadı");
      }

      let trackToPlay = null;
      for (const playlist of playlistsResponse.body.items) {
        const tracksResponse = await spotifyApi.getPlaylistTracks(playlist.id, {
          limit: 100,
          offset: 0
        });

        if (tracksResponse.body.items.length > 0) {
          const validTrack = tracksResponse.body.items.find(
            item => item.track && item.track.uri && !item.track.is_local
          );

          if (validTrack) {
            trackToPlay = validTrack.track;
            break;
          }
        }
      }

      if (!trackToPlay) {
        throw new Error("Çalınabilir şarkı bulunamadı");
      }

      await spotifyApi.play({
        device_id,
        uris: [trackToPlay.uri]
      });

      setIsLoading(false);
      setError(null);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          initializePlayback(device_id, retryCount + 1);
        }, RETRY_DELAY);
      } else {
        setError("Oynatma başlatılamadı. Lütfen tekrar deneyin.");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.accessToken) {
      router.push('/');
      return;
    }

    if (session.error === "RefreshAccessTokenError") {
      signIn('spotify', { callbackUrl: '/game' });
      return;
    }

    try {
      spotifyApi.setAccessToken(session.accessToken as string);
    } catch (error) {
      router.push('/');
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Guess The Beat',
        getOAuthToken: (cb: (token: string) => void) => { 
          if (!session.accessToken) {
            router.push('/');
            return;
          }
          cb(session.accessToken as string);
        },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        initializePlayback(device_id);
      });

      player.addListener('player_state_changed', (state: PlayerState | null) => {
        if (!state) return;
        
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setCurrentProgress(state.position);
        setDuration(state.duration);
      });

      const errorHandler = ({ message }: { message: string }) => {
        setError(message);
        setIsLoading(false);
      };

      player.addListener('initialization_error', errorHandler);
      player.addListener('authentication_error', errorHandler);
      player.addListener('account_error', errorHandler);
      player.addListener('playback_error', errorHandler);

      player.connect().then((success: boolean) => {
        if (!success) {
          setError("Player bağlantısı başarısız");
          setIsLoading(false);
        }
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [router, session, status]);

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitGuess = () => {
    router.push('/game/result');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1D14] text-white p-4">
      {isLoading ? (
        <div className="text-xl">Şarkı yükleniyor...</div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          {/* Album Cover */}
          <div className="w-64 h-64 bg-[#1E3A2B] rounded-lg mb-6 overflow-hidden">
            <Image
              src={current_track?.album?.images[0]?.url || "/placeholder-album.jpg"}
              alt="Hidden Album Cover"
              width={256}
              height={256}
              className="object-cover"
            />
          </div>

          {/* Song Title */}
          <h2 className="text-2xl font-bold mb-2">Hidden Melody</h2>
          <p className="text-gray-400 mb-8">Voice Sample</p>

          {/* Progress Bar */}
          <div className="w-full bg-[#1E3A2B] rounded-full h-1 mb-4">
            <div 
              className="bg-[#4CAF50] h-1 rounded-full" 
              style={{ width: `${(currentProgress / duration) * 100}%` }}
            ></div>
          </div>
          
          {/* Time */}
          <div className="w-full flex justify-between text-sm mb-8">
            <span>{formatTime(currentProgress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button 
              className="bg-[#4CAF50] rounded-full p-4 hover:bg-[#45A049]"
              onClick={handlePlayPause}
            >
              {is_paused ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Skip Button */}
          <button className="bg-[#1E3A2B] text-white px-6 py-2 rounded-full hover:bg-[#2A4D39] mb-8">
            Skip
          </button>

          {/* Guess Input */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Type your guess..."
              className="w-full bg-[#1E3A2B] text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
            <button 
              onClick={handleSubmitGuess}
              className="w-full bg-[#4CAF50] text-white py-3 rounded-lg hover:bg-[#45A049]"
            >
              Submit Guess
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 