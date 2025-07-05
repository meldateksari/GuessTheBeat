/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'mosaic.scdn.co',
      'i.scdn.co',
      'platform-lookaside.fbsbx.com',
      'seeded-session-images.scdn.co',
      'blend-playlist-covers.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
      'image-cdn-ak.spotifycdn.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
