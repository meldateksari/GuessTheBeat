const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Deezer API endpoint'i
app.get('/api/deezer/search', async (req, res) => {
  try {
    const { songName } = req.query;
    
    if (!songName) {
      return res.status(400).json({ error: 'Şarkı adı gerekli' });
    }

    const response = await axios.get(`https://api.deezer.com/search/track?q=${encodeURIComponent(songName)}`);
    
    if (response.data.data && response.data.data.length > 0) {
      res.json({ previewUrl: response.data.data[0].preview });
    } else {
      res.json({ previewUrl: null });
    }
  } catch (error) {
    console.error('Deezer API hatası:', error);
    res.status(500).json({ error: 'Deezer API hatası' });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
}); 