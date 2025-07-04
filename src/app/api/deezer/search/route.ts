import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const songName = searchParams.get('songName');

  if (!songName) {
    return NextResponse.json({ error: 'Şarkı adı gerekli' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(songName)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Deezer API yanıt vermedi');
    }

    // Deezer API'den gelen veriyi dönüştür
    const tracks = data.data.map((track: any) => ({
      id: track.id.toString(),
      title: track.title,
      artist: {
        name: track.artist.name
      },
      preview: track.preview
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Deezer API hatası:', error);
    return NextResponse.json({ error: 'Şarkı araması başarısız oldu' }, { status: 500 });
  }
} 