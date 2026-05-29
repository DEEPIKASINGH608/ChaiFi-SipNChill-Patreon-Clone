import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../../models/User";
import connectDb from "../../../../db/connectDb";

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
        return true;
      }
      return false;
    },

    async session({ session, user, token }) {
      await connectDb();

      const dbUser = await User.findOne({ email: session.user.email });


      if (dbUser) {
        session.user.username = dbUser.username;
      }

      return session;
    },
  }
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


