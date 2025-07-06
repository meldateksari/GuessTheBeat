interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
}

export class SpotifyService {
  private static baseUrl = 'https://api.spotify.com/v1';
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 saniye

  /**
   * Session'ı yenileme deneme fonksiyonu
   */
  private static async refreshSession(): Promise<void> {
    try {
      // Force refresh session
      const event = new CustomEvent('forceSessionRefresh');
      window.dispatchEvent(event);
      
      // Kısa bir bekleme süresi 
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Session yenileme hatası:', error);
    }
  }

  /**
   * Retry mekanizması ile API çağrısı yapma
   */
  private static async makeApiRequest<T>(
    url: string, 
    accessToken: string, 
    retryCount = 0
  ): Promise<T> {
    try {
      // Token geçerli mi kontrol et
      if (!accessToken) {
        throw new Error('Access token bulunamadı');
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Token geçersizse ve retry hakkımız varsa
      if (response.status === 401 && retryCount < this.maxRetries) {
        console.log(`Token geçersiz, retry deneniyor... (${retryCount + 1}/${this.maxRetries})`);
        
        // Session yenilemeyi dene
        await this.refreshSession();
        
        // Kısa bir süre bekle
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        
        // Yeni token ile tekrar dene
        const refreshedToken = await this.getCurrentAccessToken();
        if (refreshedToken && refreshedToken !== accessToken) {
          return this.makeApiRequest<T>(url, refreshedToken, retryCount + 1);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Hatası: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.log(`API çağrısı başarısız, retry deneniyor... (${retryCount + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.makeApiRequest<T>(url, accessToken, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Güncel access token'ı alma
   */
  private static async getCurrentAccessToken(): Promise<string | null> {
    try {
      // Client-side'da session'ı kontrol et
      if (typeof window !== 'undefined') {
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        return session?.accessToken || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Kullanıcının playlistlerini getirir
   */
  static async getUserPlaylists(accessToken: string) {
    try {
      const data = await this.makeApiRequest<{items: any[]}>(`${this.baseUrl}/me/playlists`, accessToken);
      return data.items || [];
    } catch (error) {
      console.error('Spotify playlist hatası:', error);
      throw new Error('Playlist bilgileri alınamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
    }
  }

  /**
   * Belirli bir playlist'in şarkılarını getirir
   */
  static async getPlaylistTracks(accessToken: string, playlistId: string): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeApiRequest<{items: any[]}>(`${this.baseUrl}/playlists/${playlistId}/tracks`, accessToken);
      return data.items.map((item: any) => item.track).filter((track: SpotifyTrack | null) => track !== null);
    } catch (error) {
      console.error('Spotify şarkı listesi hatası:', error);
      throw new Error('Şarkı listesi alınamadı. Lütfen tekrar deneyin.');
    }
  }

  /**
   * Kullanıcı profilini getirir
   */
  static async getUserProfile(accessToken: string) {
    try {
      return await this.makeApiRequest<any>(`${this.baseUrl}/me`, accessToken);
    } catch (error) {
      console.error('Spotify profil hatası:', error);
      throw new Error('Kullanıcı profili alınamadı. Lütfen tekrar deneyin.');
    }
  }
} 