"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";

export default function Page() {
  const appName = "YourAppName"; // Replace with your app name
  const contactEmail = "suboddlyai@gmail.com"; 

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Privacy Policy for {appName}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            <strong>Effective Date:</strong> [Insert Date]
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            <div className="space-y-8">
              <Section title="1. Information We Collect">
                <p>
                  We do not collect personal data other than what is required to
                  use the <strong>Google Login</strong>
                  and the <strong>Gmail API</strong> for providing email-related
                  services. The only data we access is:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Email Account Access:</strong> When you log in with
                    your Google account, we only access the emails you choose to
                    provide us via the <strong>Gmail API</strong>. This includes
                    reading, analyzing, and sending emails from your Gmail
                    account, using your Google login credentials to authenticate
                    the process.
                  </li>
                  <li>
                    <strong>Email Content:</strong> Our app reads and processes
                    the emails you select for analysis, using the{" "}
                    <strong>OpenAI API</strong> to analyze their content.
                  </li>
                </ul>
                <p>
                  We do <strong>not</strong> store any personal data or email
                  content on our servers. All data used in the app remains
                  within your Gmail account and is only processed when you
                  actively use the service.
                </p>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>
                  We use your information solely for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Authentication:</strong> We use{" "}
                    <strong>Google Login</strong> to authenticate your access to
                    the app securely.
                  </li>
                  <li>
                    <strong>Email Analysis:</strong> We use the{" "}
                    <strong>Gmail API</strong> to access and retrieve emails
                    that you select for analysis.
                  </li>
                  <li>
                    <strong>OpenAI Analysis:</strong> The email content you
                    provide is analyzed using the <strong>OpenAI API</strong> to
                    generate insights or responses based on the content.
                  </li>
                  <li>
                    <strong>Email Sending:</strong> The analyzed email may be
                    sent from your Gmail account using the OpenAI email response
                    (via Gmail API).
                  </li>
                </ul>
                <p>
                  <strong>No personal data is stored permanently.</strong> The
                  emails are processed in real-time for the purposes of the
                  analysis and communication based on your request.
                </p>
              </Section>

              <Section title="3. Data Security">
                <p>
                  We take the security of your information seriously and take
                  appropriate measures to protect it. Since we do not store your
                  data, your emails and personal information are secured by
                  Google's security infrastructure when using the{" "}
                  <strong>Gmail API</strong>.
                </p>
                <p>
                  We also use secure connections (SSL/TLS) for all data
                  exchanges between your app and external APIs, such as Google
                  and OpenAI, to ensure your data is encrypted in transit.
                </p>
              </Section>

              <Section title="4. Data Sharing">
                <p>
                  We do not share your personal data with any third-party
                  services except as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google:</strong> We use Google's authentication and
                    Gmail API to read and send emails. This is subject to the
                    permissions you grant when logging in using Google.
                  </li>
                  <li>
                    <strong>OpenAI:</strong> We send the content of your email
                    to the OpenAI API to perform the necessary analysis and
                    generate responses. OpenAI processes this data under the
                    terms outlined in their privacy policy.
                  </li>
                </ul>
                <p>
                  We do not sell, rent, or trade your personal information to
                  any third parties.
                </p>
              </Section>

              <Section title="5. Third-Party Services">
                <p>
                  The following third-party services may interact with your data
                  as part of providing the features of this app:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google Login & Gmail API:</strong> We use Google's
                    OAuth 2.0 service for authentication and Gmail API to access
                    your email data, subject to your consent. For more
                    information about how Google handles your data, please refer
                    to{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google's Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>OpenAI API:</strong> OpenAI is used to analyze the
                    content of the emails. Please refer to OpenAI's{" "}
                    <a
                      href="https://openai.com/policies/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    for more details about how they handle data.
                  </li>
                </ul>
              </Section>

              <Section title="6. User Rights">
                <p>
                  As a user, you have the following rights regarding your data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> You can access your emails anytime
                    via your Google account, and you can see all interactions
                    processed by our app.
                  </li>
                  <li>
                    <strong>Data Deletion:</strong> Since we do not store your
                    email data, your data is not permanently stored with us. You
                    may revoke access to your Gmail account at any time through
                    Google Account settings.
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> You may choose to
                    disconnect your Google account from the app at any time.
                    Upon disconnection, our app will no longer have access to
                    your Gmail data.
                  </li>
                </ul>
              </Section>

              <Section title="7. Children's Privacy">
                <p>
                  Our app is not intended for children under the age of 13, and
                  we do not knowingly collect any data from children. If we
                  discover that a child under the age of 13 has provided us with
                  personal information, we will take steps to delete that
                  information.
                </p>
              </Section>

              <Section title="8. Cookies and Tracking Technologies">
                <p>
                  We do not use cookies or other tracking technologies to
                  collect data from your device or track your activity on the
                  web.
                </p>
              </Section>

              <Section title="9. Changes to This Privacy Policy">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. When we update this Privacy Policy, we
                  will post the updated version on this page with a revised
                  "Effective Date" at the top.
                </p>
              </Section>

              <Section title="10. Contact Us">
                <p>
                  If you have any questions or concerns about this Privacy
                  Policy or how we handle your personal data, please contact us
                  at:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </li>
                </ul>
              </Section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
