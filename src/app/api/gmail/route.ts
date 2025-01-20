import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
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

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  console.log("Session", session);

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    // Fetch more emails with complete message details
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 5, // Increased from 5
    });

    const messages = res.data.messages?.slice(0,3) || [];

    // Fetch full message details with complete format
    const messageDetailsPromises = messages.map((message) =>
      gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "full", // Ensure we get the complete message
      })
    );

    const messageDetails = await Promise.all(messageDetailsPromises);
    
    // Process messages to include all parts
    const processedMessages = messageDetails.map((message) => {
      const data = message.data;
      
      // Function to recursively get all parts of the message
      const getAllParts = (part: any): any[] => {
        const parts: any[] = [];
        if (part.parts) {
          part.parts.forEach((p: any) => {
            parts.push(...getAllParts(p));
          });
        }
        if (part.body) {
          parts.push({
            mimeType: part.mimeType,
            data: part.body.data,
            attachmentId: part.body.attachmentId,
          });
        }
        return parts;
      };

      // Get all message parts
      const parts = data.payload ? getAllParts(data.payload) : [];

      return {
        ...data,
        parts: parts,
      };
    });

    return NextResponse.json(processedMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching Gmail data:", error);
    return NextResponse.json(
      { message: "Failed to fetch Gmail data" },
      { status: 500 }
    );
  }
}
