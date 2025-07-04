import { SpotifyService } from "@/services/spotify";

interface SpotifyTrack {
  name: string;
  artists: {
    name: string;
  }[];
}

export async function getRandomSongFromPlaylists(accessToken: string): Promise<string> {
  try {
    // Kullanıcının playlistlerini al
    const playlists = await SpotifyService.getUserPlaylists(accessToken);
    
    if (!playlists || playlists.length === 0) {
      throw new Error('Playlist bulunamadı');
    }

    // Rastgele bir playlist seç
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    // Seçilen playlistin şarkılarını al
    const tracks = await SpotifyService.getPlaylistTracks(accessToken, randomPlaylist.id);
    
    if (!tracks || tracks.length === 0) {
      throw new Error('Şarkı bulunamadı');
    }

    // Geçerli şarkıları filtrele (name ve artist bilgisi olanlar)
    const validTracks = tracks.filter((track: SpotifyTrack) => 
      track && 
      track.name && 
      track.artists && 
      track.artists.length > 0 && 
      track.artists[0].name
    );

    if (validTracks.length === 0) {
      throw new Error('Oynatılabilir şarkı bulunamadı');
    }

    // Rastgele bir şarkı seç
    const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
    
    // Şarkı adı ve sanatçı adını birleştir
    return `${randomTrack.name} - ${randomTrack.artists[0].name}`;
  } catch (error) {
    console.error('Rastgele şarkı seçilirken hata:', error);
    throw error;
  }
} 