"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEmails } from "@/lib/hooks/use-emails"
import { deleteEmail } from "@/app/actions"
import { EmailCompose } from "./email-compose"
import { CountdownTimer } from "./countdown-timer"
import { Mail, MailOpen, RefreshCw, Clock, User, ArrowLeft, Send, Trash2 } from "lucide-react"
import type { Account, Email } from "@/lib/types"

interface EmailInboxProps {
  account: Account
}

export function EmailInbox({ account }: EmailInboxProps) {
  const { emails, isLoading, error, refetch } = useEmails(account.id)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [deletingEmailId, setDeletingEmailId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const handleDeleteEmail = async (emailId: string) => {
    setDeletingEmailId(emailId)
    try {
      const result = await deleteEmail(emailId, account.id)
      if (result.success) {
        refetch()
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null)
        }
      }
    } catch (error) {
      console.error("Failed to delete email:", error)
    } finally {
      setDeletingEmailId(null)
    }
  }

  if (showCompose) {
    return <EmailCompose account={account} onBack={() => setShowCompose(false)} onSent={() => refetch()} />
  }

  if (selectedEmail) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmail(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-card-foreground">{selectedEmail.subject || "No Subject"}</CardTitle>
              <CardDescription className="text-muted-foreground">
                From: {selectedEmail.sender} • {formatDate(selectedEmail.received_at)}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEmail(selectedEmail.id)}
              disabled={deletingEmailId === selectedEmail.id}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-input border border-border rounded-lg p-4">
            <div className="whitespace-pre-wrap text-foreground">
              {selectedEmail.body || "This email has no content."}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Infernal Inbox
            </CardTitle>
            <CardDescription className="text-muted-foreground mb-3">{account.email}</CardDescription>
            <CountdownTimer createdAt={account.created_at} />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              {emails.length} {emails.length === 1 ? "message" : "messages"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCompose(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Your infernal inbox awaits. Messages sent to {account.email} will appear here automatically.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className="p-4 rounded-lg border border-border hover:bg-accent/10 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground truncate">{email.sender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(email.received_at)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEmail(email.id)
                            }}
                            disabled={deletingEmailId === email.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 h-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-card-foreground mb-1 truncate">
                        {email.subject || "No Subject"}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {email.body ? truncateText(email.body, 120) : "This email has no content."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
