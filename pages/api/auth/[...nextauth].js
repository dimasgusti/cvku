import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb"; 

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');
    
      const existingUser = await usersCollection.findOne({ email: user.email });
    
      if (!existingUser) {
        return false;
      }
    
      return true;
    },
    async session({ session, token, user }) {
      session.user.email = session.user.email || user.email;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/welcome',
  },
};

export default NextAuth(authOptions);