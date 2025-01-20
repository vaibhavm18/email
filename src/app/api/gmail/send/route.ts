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
    const fromEmail = emailData.payload?.headers?.find(
      (header) => header.name === "From"
    )?.value;
    const toEmail = emailData.payload?.headers?.find(
      (header) => header.name === "To"
    )?.value;


    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze the following email content and suggest a follow-up email:\n\n${emailContent}
          result should be like this.res: {
            subject: "", content: ""
          }
          please do not change it beacuse I am using regex and json parse
           `,
        },
      ],
    });

    const openAIResult = openAIResponse.choices[0].message.content;
    const res = openAIResult?.match(/{[^}]*}/g);
    const followUpEmail = res ? JSON.parse(res[0]) : {}; 

    console.log("OpenAI Result", followUpEmail);
    console.log("-------------")
    console.log("Parsed Follow-up Email", res); 

    const message = [
      `From: ${fromEmail}`,
      `To: ${toEmail}`,
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
     await gmail.users.messages.send({
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
