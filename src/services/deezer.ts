const BACKEND_URL = 'http://localhost:3001';

export const DeezerService = {
  async searchTrack(songName: string): Promise<string | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/deezer/search?songName=${encodeURIComponent(songName)}`);
      const data = await response.json();

      return data.previewUrl;
    } catch (error) {
      console.error('Deezer API hatası:', error);
      return null;
    }
  }
};
