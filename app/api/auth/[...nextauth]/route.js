import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../../models/User";
import connectDb from "@/db/connectDb";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github") {
        await connectDb();

        const userEmail = user.email;
        const currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
          // Creates a new user if they don't exist yet
          await User.create({
            email: userEmail,
            username: userEmail.split("@")[0],
            name: user.name || "",
            profilePic: user.image || "",
          });
        }
        return true; // Allow sign in
      }
      return false; // Reject sign in if it's not github
    },

    async session({ session, user, token }) {
      await connectDb(); // Safe fallback check

      const dbUser = await User.findOne({ email: session.user.email });

      // Safety guard: only append username if user exists in db
      if (dbUser) {
        session.user.username = dbUser.username;
      }

      return session;
    },
  }
};

// FIX: Initialize the NextAuth handler with your authOptions
const handler = NextAuth(authOptions);

// Export handler for GET and POST HTTP requests
export { handler as GET, handler as POST };


