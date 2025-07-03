import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error: "RefreshAccessTokenError" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error: "RefreshAccessTokenError" | null;
  }
} 