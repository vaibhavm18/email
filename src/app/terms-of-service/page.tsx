"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";

export default function Page() {
  const appName = "YourAppName"; // Replace with your app name
  const effectiveDate = "January 16, 2025";
  const contactEmail = "suboddlyai@gmail.com";

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Terms of Service for {appName}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            <div className="space-y-8">
              <Section title="1. Acceptance of Terms">
                <p>
                  By using {appName}, you agree to comply with and be bound by
                  these Terms of Service. If you do not agree to these terms,
                  please do not use our service.
                </p>
              </Section>

              <Section title="2. Description of Service">
                <p>
                  {appName} is a web application that allows users to analyze
                  and respond to emails using artificial intelligence. The
                  service utilizes Google Login for authentication and accesses
                  your Gmail account to process selected emails.
                </p>
              </Section>

              <Section title="3. User Rights and Responsibilities">
                <p>As a user of {appName}, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Access and use the features of the application as intended.
                  </li>
                  <li>
                    Disconnect your Google account from the app at any time.
                  </li>
                  <li>
                    Request support for any issues related to the app's
                    functionality.
                  </li>
                </ul>
                <p>As a user, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Maintaining the confidentiality of your Google account
                    credentials.
                  </li>
                  <li>
                    Using the service in compliance with all applicable laws and
                    regulations.
                  </li>
                  <li>
                    Ensuring that your use of the app does not infringe on the
                    rights of others.
                  </li>
                </ul>
              </Section>

              <Section title="4. Intellectual Property">
                <p>
                  All content, features, and functionality of {appName},
                  including but not limited to text, graphics, logos, and
                  software, are the exclusive property of {appName} and are
                  protected by international copyright, trademark, and other
                  intellectual property laws.
                </p>
              </Section>

              <Section title="5. Limitation of Liability">
                <p>
                  {appName} and its creators shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages resulting from your access to or use of, or inability
                  to access or use, the service.
                </p>
              </Section>

              <Section title="6. Privacy and Data Usage">
                <p>
                  Your use of {appName} is also governed by our Privacy Policy.
                  Please review our Privacy Policy to understand how we collect,
                  use, and protect your information.
                </p>
              </Section>

              <Section title="7. Modifications to Service">
                <p>
                  We reserve the right to modify or discontinue, temporarily or
                  permanently, the service (or any part thereof) with or without
                  notice. You agree that {appName} shall not be liable to you or
                  to any third party for any modification, suspension, or
                  discontinuance of the service.
                </p>
              </Section>

              <Section title="8. Termination">
                <p>
                  We may terminate or suspend your access to the service
                  immediately, without prior notice or liability, for any reason
                  whatsoever, including without limitation if you breach the
                  Terms. Upon termination, your right to use the service will
                  immediately cease.
                </p>
              </Section>

              <Section title="9. Governing Law">
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of [Your Jurisdiction], without regard to its
                  conflict of law provisions.
                </p>
              </Section>

              <Section title="10. Changes to Terms">
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will try to provide at least 30 days' notice prior to any new
                  terms taking effect.
                </p>
              </Section>

              <Section title="11. Contact Us">
                <p>
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <p className="font-semibold mt-2">
                  Email:
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {contactEmail}
                  </a>
                </p>
              </Section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
