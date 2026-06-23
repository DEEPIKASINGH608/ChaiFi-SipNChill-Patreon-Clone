import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import TwitterProvider from "next-auth/providers/twitter"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import mongoose from "mongoose";
import User from "../../../../models/User";
import connectDb from "../../../../db/connectDb";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // Recommended for modern Twitter API v2
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
      })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github") {
        await connectDb();

        const userEmail = user.email;
        const currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
          await User.create({
            email: userEmail,
            username: userEmail.split("@")[0],
            name: user.name || "",
            profilepic: user.image || "",
          });
        }
        return true;
      }
      return false;
    },

    async jwt({ token, user, trigger, session }){
      await connectDb();
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.username = dbUser.username;
          token.name = dbUser.name;
          token.profilepic = dbUser.profilepic;
          token.coverpic = dbUser.coverpic;
          token.razorpayid = dbUser.razorpayid;
          token.razorpaysecret = dbUser.razorpaysecret;
        }
      }

      // Handle live client-side session mutations triggered by update()
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.profilepic = token.profilepic;
        session.user.coverpic = token.coverpic;
        session.user.razorpayid = token.razorpayid;
        session.user.razorpaysecret = token.razorpaysecret;
      }

      return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


