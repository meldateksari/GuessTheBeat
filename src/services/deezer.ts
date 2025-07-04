export interface DeezerTrack {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  preview: string;
}

export class DeezerService {
  private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  static async searchTrack(songName: string): Promise<DeezerTrack[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/deezer/search?songName=${encodeURIComponent(songName)}`);
      
      if (!response.ok) {
        throw new Error('Deezer API yanıt vermedi');
      }

      const data = await response.json();
      return data.tracks || [];
    } catch (error) {
      console.error('Deezer arama hatası:', error);
      return [];
    }
  }
}
