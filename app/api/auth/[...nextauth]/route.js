import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { signIn } from "next-auth/react";
import mongoose, { connect } from "mongoose";
import User from "../../../../models/User";
import connectDb from "@/db/connectDb";

//import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,


  callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
   if(account.provider == "github"){
    await connectDb();
    //check if user already exists in the database
    const userEmail = user.email;
    const currentUser =await User.findOne({ email: userEmail });
    if (!currentUser) {

      //if not, create a new user
      const newUser = new User({
        email: userEmail,
        username: userEmail.split("@")[0],
        name: user.name || "",          // Fallback if name doesn't exist
        profilePic: user.image || "",
      });
      user.name = newUser.username; // Update the user object with the name from the database
      const savedUser = await newUser.save();
      await newUser.save();
    } else {
      user.name = currentUser.username; // Update the user object with the name from the database
    }
    return true;
   }
   return false;
  },
   async session({ session, user, token }) {
    const dbUser = await User.findOne({ email: session.user.email });
      console.log(dbUser);
      session.user.username = dbUser.username;
    return session;
  },
  }
};


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };

