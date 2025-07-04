import NextAuth, { DefaultSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string | undefined;
    error: string | null | undefined;
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    expiresAt: number | undefined;
    error: string | undefined;
  }
}

// Sadece gerekli scope'ları kullanıyoruz
const REQUIRED_SCOPES = [
  "streaming",
  "user-read-email",
  "playlist-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing"
] as const;

const SPOTIFY_REFRESH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const MAX_REFRESH_ATTEMPTS = 3;

async function refreshAccessToken(token: any, attempt = 1): Promise<any> {
  try {
    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(SPOTIFY_REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw new Error(tokens.error_description || 'Failed to refresh token');
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    };
  } catch (error) {
    if (attempt < MAX_REFRESH_ATTEMPTS) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      return refreshAccessToken(token, attempt + 1);
    }
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: REQUIRED_SCOPES.join(' ')
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = (account.expires_at as number) * 1000;
        return token;
      }

      if (token.expiresAt && Date.now() > token.expiresAt) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken;
        session.error = token.error || null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
});

export { handler as GET, handler as POST }; 




