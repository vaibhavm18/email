"use client";

import GmailViewer from "@/components/ui/Gmail";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Page() {
  return (
    <SessionProvider>
      <GmailViewer />
    </SessionProvider>
  );
}
