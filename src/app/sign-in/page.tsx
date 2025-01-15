'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, User, MessageSquare } from 'lucide-react'

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
    body: { data: string };
  };
}

export default function GmailViewer() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<GmailMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchEmails = async () => {
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch("/api/gmail")
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError('Failed to fetch emails. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Gmail Viewer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gmail Access</CardTitle>
        </CardHeader>
        <CardContent>
          {!session ? (
            <Button onClick={() => signIn("google")}>Sign in with Google</Button>
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
                    'Fetch Emails'
                  )}
                </Button>
                <Button onClick={() => signOut()} variant="outline">Sign Out</Button>
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
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  {message.payload.headers.find((header) => header.name === 'Subject')?.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="mr-2 h-4 w-4" />
                  <span>From: {message.payload.headers.find((header) => header.name === 'From')?.value}</span>
                </div>
                <div className="flex items-start text-sm mb-2">
                  <MessageSquare className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{message.snippet}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold mb-2">Message Body:</h4>
                  <p className="text-sm text-gray-600">
                    {message.payload.body.data && decodeURIComponent(escape(atob(message.payload.body.data)))}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

