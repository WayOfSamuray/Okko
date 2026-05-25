import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../lib/jwt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }: any) {
      try {
        await connectDB();

        let existingUser = await User.findOne({
          email: user.email,
        });

        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            avatar: user.image,
            password: null,
          });
        }

        return true;
      } catch (e) {
        console.error("NEXTAUTH SIGNIN ERROR:", e);

        return false;
      }
    },

    async jwt({ token, user }: any) {
      if (user) {
        await connectDB();

        const dbUser = await User.findOne({
          email: user.email,
        });

        if (dbUser) {
          token.id = dbUser._id.toString();

          token.accessToken = generateAccessToken({
            id: dbUser._id,
            email: dbUser.email,
          });

          token.refreshToken = generateRefreshToken({
            id: dbUser._id,
            email: dbUser.email,
          });
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user.id = token.id;

      session.accessToken = token.accessToken;

      session.refreshToken = token.refreshToken;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };