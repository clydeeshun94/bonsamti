"use client"

import { useState } from "react"
import { generateIdentity } from "@/app/actions"
import type { Account, GenerateIdentityRequest } from "@/lib/types"

export function useIdentity() {
  const [account, setAccount] = useState<Account | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (request: GenerateIdentityRequest) => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateIdentity(request)

      if (result.success && result.account) {
        setAccount(result.account)
      } else {
        setError(result.error || "Failed to generate identity")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Identity generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const reset = () => {
    setAccount(null)
    setError(null)
  }

  return {
    account,
    isGenerating,
    error,
    generate,
    reset,
  }
}
