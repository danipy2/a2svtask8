import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signup",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Add user ID and name to token
      if (account) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and name to session
      session.user.id = token.id;
      session.user.name = token.name;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to welcome page after successful sign-in
      return `${baseUrl}/welcome`;
    },
  },
});

export { handler as GET, handler as POST };