import { SpotifyService } from '@/services/spotify';

export async function getRandomSongFromPlaylists(accessToken: string): Promise<string> {
  try {
    // Kullanıcının playlistlerini al
    const playlists = await SpotifyService.getUserPlaylists(accessToken);
    
    if (!playlists || playlists.length === 0) {
      throw new Error('Kullanıcının playlist bulunamadı');
    }

    // Rastgele bir playlist seç
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    // Seçilen playlistin şarkılarını al
    const playlistTracks = await SpotifyService.getPlaylistTracks(accessToken, randomPlaylist.id);
    
    if (!playlistTracks || playlistTracks.length === 0) {
      throw new Error('Seçilen playlistte şarkı bulunamadı');
    }

    // Rastgele bir şarkı seç
    const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];
    
    // Şarkı adını ve sanatçıyı döndür
    if (randomTrack.track && randomTrack.track.name && randomTrack.track.artists) {
      const artistName = randomTrack.track.artists[0]?.name || 'Bilinmeyen Sanatçı';
      return `${randomTrack.track.name} - ${artistName}`;
    }
    
    throw new Error('Şarkı bilgisi alınamadı');
  } catch (error) {
    console.error('Rastgele şarkı seçilirken hata:', error);
    throw error;
  }
} 