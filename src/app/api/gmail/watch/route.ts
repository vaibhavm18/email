import { google } from "googleapis";
import { NextResponse } from "next/server";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const authenticateGmail = async (accessToken: string) => {
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  // Check if the access token is valid by attempting to get the user's profile
  try {
    const profile = await gmail.users.getProfile({ userId: "me" });
    return auth; // The user's email address
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Login Required"); // Throw an error if authentication fails
  }
};

const watchGmail = async (authClient: any) => {
  const gmail = google.gmail({ version: "v1", auth: authClient });

  const response = await gmail.users.watch({
    userId: "me",
    requestBody: {
      labelIds: ["INBOX"], // Monitor the inbox for new messages
      topicName: "projects/active-display-448008-d8/topics/gmail-inbox-topic", // Pub/Sub Topic
    },
  });

  console.log("Watch request sent:", response.data);
  return response.data;
};

export async function POST(req: Request) {
  const { accessToken } = await req.json(); 
  try {
    const authClient = await authenticateGmail(accessToken);
    const response = await watchGmail(authClient);
    return NextResponse.json({ message: "Watching inbox", response });
  } catch (error) {
    console.log("Error watching Gmail inbox", error);
    return NextResponse.json(
      { message: "Error watching Gmail inbox", error },
      { status: 500 }
    );
  }
}
