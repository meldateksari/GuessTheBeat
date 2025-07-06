// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { SpotifyService } from '@/services/spotify';
// import { useRouter } from 'next/navigation';

// interface SpotifyProfile {
//   display_name: string;
//   email: string;
//   images: { url: string }[];
//   followers: { total: number };
//   country: string;
//   product: string;
// }

// interface Playlist {
//   id: string;
//   name: string;
//   images: { url: string }[];
//   tracks: { total: number };
// }

// export default function ProfilePage() {
//   const { data: session, update } = useSession();
//   const router = useRouter();
//   const [profile, setProfile] = useState<SpotifyProfile | null>(null);
//   const [playlists, setPlaylists] = useState<Playlist[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   // Session refresh dinleyicisi
//   useEffect(() => {
//     const handleSessionRefresh = async () => {
//       try {
//         console.log('Session yenileme tetiklendi...');
//         await update(); // Session'ı yenile
//         setRetryCount(prev => prev + 1);
//       } catch (error) {
//         console.error('Session yenileme hatası:', error);
//       }
//     };

//     window.addEventListener('forceSessionRefresh', handleSessionRefresh);
//     return () => {
//       window.removeEventListener('forceSessionRefresh', handleSessionRefresh);
//     };
//   }, [update]);

//   // Session error kontrolü
//   useEffect(() => {
//     if (session?.error === 'RefreshAccessTokenError') {
//       console.log('Token yenileme hatası tespit edildi, yeniden giriş gerekli');
//       setError('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
//       setTimeout(() => {
//         router.push('/');
//       }, 3000);
//     }
//   }, [session, router]);

//   useEffect(() => {
//     const fetchSpotifyData = async () => {
//       if (!session?.accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setError(null);
        
//         // Paralel olarak profil ve playlist verilerini çek
//         const [profileData, playlistData] = await Promise.all([
//           SpotifyService.getUserProfile(session.accessToken),
//           SpotifyService.getUserPlaylists(session.accessToken)
//         ]);

//         setProfile(profileData);
//         setPlaylists(playlistData);
//         setRetryCount(0); // Başarılı olursa retry sayacını sıfırla
//       } catch (error) {
//         console.error('Spotify verisi çekilirken hata:', error);
//         const errorMessage = error instanceof Error ? error.message : 'Veriler yüklenirken bir hata oluştu';
        
//         // Retry mekanizması - maksimum 3 deneme
//         if (retryCount < 3) {
//           setError(`${errorMessage} Tekrar deneniyor... (${retryCount + 1}/3)`);
//           setTimeout(() => {
//             setRetryCount(prev => prev + 1);
//           }, 2000);
//           return; // Loading'i kapatma
//         } else {
//           setError(errorMessage);
//         }
//       } finally {
//         // Sadece retry bittiğinde loading'i kapat
//         if (retryCount >= 3 || !error) {
//           setLoading(false);
//         }
//       }
//     };

//     if (session?.accessToken || retryCount > 0) {
//       fetchSpotifyData();
//     }
//   }, [session, retryCount, update, router]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">
//           {retryCount > 0 ? `Veriler yükleniyor... (${retryCount}/3)` : 'Yükleniyor...'}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen p-4">
//         <div className="text-red-500 mb-4 text-center text-lg">{error}</div>
//         {retryCount < 3 && (
//           <button 
//             onClick={() => setRetryCount(prev => prev + 1)}
//             className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
//           >
//             Tekrar Dene
//           </button>
//         )}
//       </div>
//     );
//   }

//   if (!session) {
//     return <div className="flex justify-center items-center min-h-screen">Lütfen giriş yapın</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {profile && (
//         <div className="bg-gray-800 rounded-lg p-6 mb-8">
//           <div className="flex items-center gap-6">
//             {profile.images?.[0]?.url && (
//               <Image
//                 src={profile.images[0].url}
//                 alt="Profil resmi"
//                 width={150}
//                 height={150}
//                 className="rounded-full"
//               />
//             )}
//             <div>
//               <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
//               <p className="text-gray-400 mb-1">Email: {profile.email}</p>
//               <p className="text-gray-400 mb-1">Ülke: {profile.country}</p>
//               <p className="text-gray-400 mb-1">Takipçi: {profile.followers.total}</p>
//               <p className="text-gray-400">Hesap Türü: {profile.product}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {playlists && playlists.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Çalma Listeleri</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {playlists.map((playlist) => (
//               <div 
//                 key={playlist.id}
//                 className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
//               >
//                 {playlist.images?.[0]?.url && (
//                   <Image
//                     src={playlist.images[0].url}
//                     alt={playlist.name}
//                     width={200}
//                     height={200}
//                     className="rounded-lg mb-3 w-full"
//                   />
//                 )}
//                 <h3 className="font-semibold mb-1">{playlist.name}</h3>
//                 <p className="text-gray-400">{playlist.tracks.total} şarkı</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 

import NotFoundPage from '@/components/NotFoundPage';

export default function ProfilePage() {
  return <NotFoundPage />;
  }