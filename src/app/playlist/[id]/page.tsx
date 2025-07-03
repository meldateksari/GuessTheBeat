'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Track {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    duration_ms: number;
  };
}

interface PlaylistDetail {
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    items: Track[];
  };
}

export default function PlaylistDetail() {
  const { data: session } = useSession();
  const params = useParams();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (session?.accessToken && params.id) {
        try {
          const response = await fetch(`https://api.spotify.com/v1/playlists/${params.id}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await response.json();
          setPlaylist(data);
        } catch (error) {
          console.error('Playlist verisi çekilirken hata:', error);
        }
      }
      setLoading(false);
    };

    fetchPlaylistData();
  }, [session, params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center min-h-screen">Lütfen giriş yapın</div>;
  }

  if (!playlist) {
    return <div className="flex justify-center items-center min-h-screen">Playlist bulunamadı</div>;
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-8 mb-8">
        {playlist.images?.[0]?.url && (
          <Image
            src={playlist.images[0].url}
            alt={playlist.name}
            width={300}
            height={300}
            className="rounded-lg shadow-xl"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-gray-400">{playlist.description}</p>
          <p className="text-gray-400 mt-2">{playlist.tracks.items.length} şarkı</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-[auto,1fr,1fr,auto] gap-4 mb-4 px-4 py-2 text-gray-400">
          <div>#</div>
          <div>Başlık</div>
          <div>Albüm</div>
          <div>Süre</div>
        </div>
        {playlist.tracks.items.map((item, index) => (
          <div
            key={item.track.id}
            className="grid grid-cols-[auto,1fr,1fr,auto] gap-4 px-4 py-3 hover:bg-gray-700 rounded-lg items-center"
          >
            <div className="text-gray-400">{index + 1}</div>
            <div className="flex items-center gap-4">
              {item.track.album.images?.[0]?.url && (
                <Image
                  src={item.track.album.images[0].url}
                  alt={item.track.album.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              <div>
                <div className="font-medium">{item.track.name}</div>
                <div className="text-gray-400 text-sm">
                  {item.track.artists.map(artist => artist.name).join(', ')}
                </div>
              </div>
            </div>
            <div className="text-gray-400">{item.track.album.name}</div>
            <div className="text-gray-400">{formatDuration(item.track.duration_ms)}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 