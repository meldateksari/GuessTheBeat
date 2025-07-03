# İlk olarak spotify dev hesabı açmamız lazım

- https://developer.spotify.com/dashboard

Adresinden  bir proje oluştur ardından o projede bulunan 

**Client ID** ve **Client Secret** değerlerini kopyalayıp .env dosyasındaki **=** sonrasına yapıştır

```bash
SPOTIFY_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
```

# Şu anlık ngrok hesabı lazım hesap açmak için 

- https://dashboard.ngrok.com/signup

## Ngrok Api key için:

- https://dashboard.ngrok.com/get-started/your-authtoken

## Bilgisayara tanımlamak içi 

```bash
ngrok config add-authtoken $YOUR_AUTHTOKEN
```


# Projeyi başlatmak için adımlar

1. ngrok server ı başlat  
```bash
ngrok http 3000
```

2. .env dosyasındaki **NEXTAUTH_URL** URLini ngrok terminalinde açılan **Forwarding** URLi ile değiştir

3. npm server ı başlat

```bash
npm run dev
```

4.  <a href= "https://developer.spotify.com/dashboard">Spotify Dev Console</a> da bulunan Redirect URIs değerine **ngrok Forwarding URL** + **/api/auth/callback/spotify**
değerini ekle ve kaydet örneğin : 

```bash
https://414a-176-54-254-204.ngrok-free.app/api/auth/callback/spotify
```


5.Çalışıyor

![Done](tenor.gif)