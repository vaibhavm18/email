import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Mail,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GmailMessagePart {
  mimeType: string;
  data?: string;
  attachmentId?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
    body: { data: string };
    parts?: GmailMessagePart[];
  };
  parts?: GmailMessagePart[];
}

const decodeBase64 = (encodedData: string) => {
  // Replace URL-safe characters back to standard base64 characters
  const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");

  // Fix padding
  const fixedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  try {
    // Decode base64 to binary string
    const binaryString = atob(fixedBase64);

    // Convert binary string to UTF-8
    return decodeURIComponent(
      Array.from(binaryString)
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    console.error("Failed to decode base64:", e);
    return "Error decoding message";
  }
};

// Add new helper function to get email content
const getEmailContent = (message: GmailMessage) => {
  // First check parts array
  if (message.parts) {
    // Try to find HTML content first
    const htmlPart = message.parts.find(
      (part) => part.mimeType === "text/html"
    );
    if (htmlPart?.data) {
      return { content: decodeBase64(htmlPart.data), isHtml: true };
    }
    // Fall back to plain text
    const textPart = message.parts.find(
      (part) => part.mimeType === "text/plain"
    );
    if (textPart?.data) {
      return { content: decodeBase64(textPart.data), isHtml: false };
    }
  }

  // If no parts, try the payload body
  if (message.payload.body?.data) {
    return { content: decodeBase64(message.payload.body.data), isHtml: false };
  }

  // Fallback to snippet
  return { content: message.snippet, isHtml: false };
};

// Add helper function to get header value
const getHeader = (message: GmailMessage, headerName: string) => {
  return (
    message.payload.headers.find(
      (header) => header.name.toLowerCase() === headerName.toLowerCase()
    )?.value || ""
  );
};

export default function GmailViewer() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());

  const toggleEmailExpansion = (id: string) => {
    setExpandedEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sendEmail = async (message: GmailMessage) => {
    try {
      setIsLoading(true);
      console.log("Message", message);

      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: message.id, threadId: message.threadId }),
      });

      if (!res.ok) {
        throw new Error("Failed to send email");
      }

      const data = await res.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startGmailWatch = async (accessToken: string) => {
    setIsLoading(true); // Set loading state to true
    try {
      const res = await fetch("/api/gmail/watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      console.log("Gmail Watch API Response:", data);
    } catch (error) {
      console.error("Error starting Gmail watch:", error);
      setError("Failed to start Gmail watch. Please try again."); // Set error message
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  const fetchEmails = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/gmail");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Failed to fetch emails. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Gmail Viewer</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gmail Access</CardTitle>
        </CardHeader>
        <CardContent>
          {!session ? (
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          ) : (
            <div className="space-y-4">
              <p>Welcome, {session.user?.name}</p>
              <div className="flex space-x-2">
                <Button onClick={fetchEmails} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Emails"
                  )}
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={() => signOut()}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Emails</h2>
          {messages.map((message) => (
            <Card key={message.id} className="overflow-hidden">
              <CardHeader
                className="bg-gray-50 cursor-pointer"
                onClick={() => toggleEmailExpansion(message.id)}
              >
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    {getHeader(message, "Subject")}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        sendEmail(message);
                      }}
                    >
                      Use OpenAI to Send Email
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailExpansion(message.id);
                      }}
                    >
                      {expandedEmails.has(message.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                <div className="text-sm text-gray-600">
                  <span>{getHeader(message, "From")}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(getHeader(message, "Date")).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              {expandedEmails.has(message.id) && (
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    {/* To info */}
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>To: {getHeader(message, "To")}</span>
                    </div>

                    {/* Labels */}
                    {message.labelIds && (
                      <div className="flex gap-2">
                        {message.labelIds.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Email Content */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold mb-2">Message:</h4>
                      {(() => {
                        const { content, isHtml } = getEmailContent(message);
                        return isHtml ? (
                          <div
                            className="text-sm text-gray-600 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        ) : (
                          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                            {content}
                          </pre>
                        );
                      })()}
                    </div>

                    {/* Attachments section */}
                    {message.parts?.some((part) => part.attachmentId) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold mb-2">
                          Attachments:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {message.parts
                            .filter((part) => part.attachmentId)
                            .map((part, index) => (
                              <div
                                key={part.attachmentId || index}
                                className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
                              >
                                {part.mimeType}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
