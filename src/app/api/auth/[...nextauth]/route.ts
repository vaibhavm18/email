import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/gmail.readonly", // Gmail read-only scope
          access_type: "offline",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Optional custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // for session signing
  callbacks: {
    // @ts-ignore
    async jwt({ token, account }) {
      console.log("T", token, account);
      // Add the access_token and refresh_token to the JWT token
      if (account) {
        token.accessToken = account.access_token;
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
      }
      return token;
    },
    // @ts-ignore
    async session({ session, token }) {
      console.log("S", session, token);
      // Add the access_token and refresh_token from the JWT to the session
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
