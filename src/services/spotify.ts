interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export class SpotifyService {
  private static BASE_URL = 'https://api.spotify.com/v1';

  /**
   * Kullanıcının playlistlerini getirir
   */
  static async getUserPlaylists(accessToken: string): Promise<Playlist[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/me/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as SpotifyError;
        throw new Error(errorData.error.message || 'Playlist verisi alınamadı');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Spotify playlist hatası:', error);
      throw error;
    }
  }

  /**
   * Belirli bir playlist'in şarkılarını getirir
   */
  static async getPlaylistTracks(accessToken: string, playlistId: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as SpotifyError;
        throw new Error(errorData.error.message || 'Playlist şarkıları alınamadı');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Spotify şarkı listesi hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı profilini getirir
   */
  static async getUserProfile(accessToken: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as SpotifyError;
        throw new Error(errorData.error.message || 'Kullanıcı profili alınamadı');
      }

      return await response.json();
    } catch (error) {
      console.error('Spotify profil hatası:', error);
      throw error;
    }
  }
} 