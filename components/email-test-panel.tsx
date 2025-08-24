"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Send, TestTube } from "lucide-react"
import type { Account } from "@/lib/types"

interface EmailTestPanelProps {
  account: Account
}

export function EmailTestPanel({ account }: EmailTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [from, setFrom] = useState("test@example.com")
  const [subject, setSubject] = useState("Test Email")
  const [body, setBody] = useState("This is a test email to verify the inbox functionality.")
  const { toast } = useToast()

  const sendTestEmail = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/emails/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountEmail: account.email,
          from,
          subject,
          body,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Test email sent!",
          description: "Check your inbox for the new message",
        })
        // Reset form
        setFrom("test@example.com")
        setSubject("Test Email")
        setBody("This is a test email to verify the inbox functionality.")
      } else {
        toast({
          title: "Failed to send test email",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error sending test email",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <TestTube className="h-5 w-5 text-secondary" />
          Test Email Delivery
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Send a test email to {account.email} to verify the inbox functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-card-foreground">
            From Address
          </Label>
          <Input
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="sender@example.com"
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-card-foreground">
            Subject
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-card-foreground">
            Message Body
          </Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email content..."
            rows={4}
            className="bg-input border-border text-foreground resize-none"
          />
        </div>

        <Button
          onClick={sendTestEmail}
          disabled={isLoading || !from || !subject}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Send Test Email"}
        </Button>
      </CardContent>
    </Card>
  )
}
