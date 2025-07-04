'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SpotifyService } from '@/services/spotify';

interface SpotifyProfile {
  display_name: string;
  email: string;
  images: { url: string }[];
  followers: { total: number };
  country: string;
  product: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: { total: number };
  images: { url: string }[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      if (session?.accessToken) {
        try {
          // Kullanıcı profil bilgilerini çek
          const profileData = await SpotifyService.getUserProfile(session.accessToken);
          setProfile(profileData);

          // Kullanıcının playlist'lerini çek
          const playlistData = await SpotifyService.getUserPlaylists(session.accessToken);
          setPlaylists(playlistData);
        } catch (error) {
          console.error('Spotify verisi çekilirken hata:', error);
          setError(error instanceof Error ? error.message : 'Veriler yüklenirken bir hata oluştu');
        }
      }
      setLoading(false);
    };

    fetchSpotifyData();
  }, [session]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center min-h-screen">Lütfen giriş yapın</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {profile && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            {profile.images?.[0]?.url && (
              <Image
                src={profile.images[0].url}
                alt="Profil resmi"
                width={150}
                height={150}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
              <p className="text-gray-400 mb-1">Email: {profile.email}</p>
              <p className="text-gray-400 mb-1">Ülke: {profile.country}</p>
              <p className="text-gray-400 mb-1">Takipçi: {profile.followers.total}</p>
              <p className="text-gray-400">Hesap Türü: {profile.product}</p>
            </div>
          </div>
        </div>
      )}

      {playlists && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Çalma Listeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Link 
                href={`/playlist/${playlist.id}`} 
                key={playlist.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                {playlist.images?.[0]?.url && (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={200}
                    height={200}
                    className="rounded-lg mb-3 w-full"
                  />
                )}
                <h3 className="font-semibold mb-1">{playlist.name}</h3>
                <p className="text-gray-400">{playlist.tracks.total} şarkı</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 