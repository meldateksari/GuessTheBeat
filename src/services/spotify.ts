interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
}

export class SpotifyService {
  private static baseUrl = 'https://api.spotify.com/v1';

  /**
   * Kullanıcının playlistlerini getirir
   */
  static async getUserPlaylists(accessToken: string) {
    try {
      const response = await fetch(`${this.baseUrl}/me/playlists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Spotify API yanıt vermedi');
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
  static async getPlaylistTracks(accessToken: string, playlistId: string): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(`${this.baseUrl}/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Spotify API yanıt vermedi');
      }

      const data = await response.json();
      return data.items.map((item: any) => item.track).filter((track: SpotifyTrack | null) => track !== null);
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
      const response = await fetch(`${this.baseUrl}/me`, {
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