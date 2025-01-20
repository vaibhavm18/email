import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const message = await req.json();
  const decodedMessage = Buffer.from(message.message.data, "base64").toString("utf-8");
  console.log("Received Pub/Sub message:", decodedMessage);

  // Process the notification here (you can trigger follow-up email logic)

  return NextResponse.json({ message: "Notification received and processed" });
}
