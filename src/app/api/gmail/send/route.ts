import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../route";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, threadId } = await request.json();

  if (!id || !threadId) {
    return NextResponse.json(
      { message: "Need Id and threadId" },
      { status: 401 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    // Fetch the email content using the Gmail API
    console.log("Email starts")
    const emailResponse = await gmail.users.messages.get({
      userId: "me",
      id: id,
      format: "full",
    });

  const emailData = emailResponse.data;
  const emailContent = emailData.snippet; // Simplified for example; you may want to extract the full body
  const headers = emailData.payload?.headers || [];

  // Log headers for debugging

  // Extract "From" and "To" emails
  const fromHeader = headers.find((header) => header.name === "From")?.value;
  const fromEmail = fromHeader ? fromHeader.match(/<(.+)>/)?.[1] : null;

  const toEmail = headers.find((header) => header.name === "To")?.value;

  console.log("From", fromEmail, toEmail)


  const openAIResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Analyze the following email content and suggest a follow-up email:\n\n${emailContent}.
        from: ${fromHeader} \n to: ${toEmail} \n .
        Result should be in this format: res: { "subject": "subject here", "content": "content here" }
        you should act like the the person who sends email so do not add [Recipient's Name] like this.
        So add those name as well with from.
        
        Please do not change it, as I am using regex and JSON parsing. 
        Ensure the result is always wrapped with "res: {...}".`
      },
    ],
  });

  const openAIResult = openAIResponse.choices[0].message.content;

  // Ensure the result always matches the expected format (res: { ... })
  const res = openAIResult?.match(/res:\s*\{[^}]*\}/g);

  const followUpEmail = res ? JSON.parse(res[0].substring(4).trim()) : {};
    console.log("OpenAI Result", followUpEmail);
    console.log("-------------")
    console.log("Parsed Follow-up Email", res); 

    const message = [
      `From: ${toEmail}`,
      `To: ${fromEmail}`,
      `Subject: ${followUpEmail.subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "",
      followUpEmail.content ||
        `Hi,\n\nThank you for your email. We have received it and will get back to you shortly.\n\nBest regards,\nYour Team`,
    ].join("\n");

    // Encode the message in base64 format
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the email via Gmail API
     const s = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });


    return NextResponse.json(
      { message: "Follow-up email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending follow-up email:", error);
    return NextResponse.json(
      { message: "Failed to send follow-up email" },
      { status: 500 }
    );
  }
}
