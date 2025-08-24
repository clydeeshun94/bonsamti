"use client"

import { useState, useEffect } from "react"
import { getAccountEmails } from "@/app/actions"
import type { Email } from "@/lib/types"

export function useEmails(accountId: string | null) {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = async () => {
    if (!accountId) {
      setEmails([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await getAccountEmails(accountId)

      if (result.success && result.emails) {
        setEmails(result.emails as Email[])
      } else {
        setError(result.error || "Failed to fetch emails")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Email fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()

    // Set up polling for new emails every 5 seconds
    const interval = setInterval(fetchEmails, 5000)

    return () => clearInterval(interval)
  }, [accountId])

  return {
    emails,
    isLoading,
    error,
    refetch: fetchEmails,
  }
}
