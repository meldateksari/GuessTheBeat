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
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie, Set-Cookie' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        // Tüm sayfalara genel CORS izni
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ]
  },
}

module.exports = nextConfig