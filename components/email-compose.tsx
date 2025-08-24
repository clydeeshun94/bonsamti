"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendEmail } from "@/app/actions"
import { Send, ArrowLeft, Loader2 } from "lucide-react"
import type { Account } from "@/lib/types"

interface EmailComposeProps {
  account: Account
  onBack: () => void
  onSent: () => void
}

export function EmailCompose({ account, onBack, onSent }: EmailComposeProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError("All fields are required")
      return
    }

    if (!to.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await sendEmail({
        fromAccountId: account.id,
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
      })

      if (result.success) {
        onSent()
        onBack()
      } else {
        setError(result.error || "Failed to send email")
      }
    } catch (err) {
      setError("Failed to send email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Send className="h-5 w-5 text-primary" />
              Compose Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">From: {account.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="to" className="text-foreground">
            To
          </Label>
          <Input
            id="to"
            type="email"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-foreground">
            Subject
          </Label>
          <Input
            id="subject"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-foreground">
            Message
          </Label>
          <Textarea
            id="body"
            placeholder="Write your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="bg-input border-border text-foreground resize-none"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="border-border text-foreground hover:bg-accent bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
