import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/data"
import { headers } from "next/headers"
import crypto from "crypto"
import { sanitizeEmailContent, extractPlainTextFromHtml } from "@/lib/utils/email-parser"

// Types for Resend inbound email webhook payload
interface InboundEmailPayload {
  type: string
  created_at: string
  data: {
    from: string
    to: string[]
    subject: string
    html?: string
    text?: string
    reply_to?: string
    message_id: string
    date: string
  }
}

// Legacy format support
interface LegacyInboundEmailPayload {
  from: string
  to: string[] | string
  subject: string
  text?: string
  html?: string
  plain?: string
  reply_to?: string
  date: string
  message_id?: string
}

// Verify Resend webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) {
    console.log("[Bonsamti] No signature or secret provided, skipping verification in development")
    return process.env.NODE_ENV === "development"
  }

  try {
    // Resend uses svix-timestamp and svix-signature headers
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64")
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  } catch (error) {
    console.error("[Bonsamti] Signature verification error:", error)
    return false
  }
}

// Normalize email addresses to array format
function normalizeEmailAddresses(addresses: string[] | string): string[] {
  if (Array.isArray(addresses)) {
    return addresses
  }
  return [addresses]
}

// Extract email content from Resend payload
function extractEmailContent(data: any): string {
  return data.text || data.plain || data.html || ""
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const signature =
      headersList.get("svix-signature") ||
      headersList.get("webhook-signature") ||
      ""

    const rawBody = await request.text()
    console.log("[Bonsamti] Received webhook request, body length:", rawBody.length)

    // Verify webhook signature
    const webhookSecret = process.env.RESEND_SIGNING_SECRET

    if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error("[Bonsamti] Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let payload: InboundEmailPayload | LegacyInboundEmailPayload
    try {
      payload = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("[Bonsamti] Failed to parse JSON payload:", parseError)
      console.log("[Bonsamti] Raw body:", rawBody.substring(0, 500))
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    // Handle Resend webhook format
    let emailData: any
    if ('type' in payload && payload.type === 'email.received') {
      emailData = payload.data
    } else {
      // Legacy format
      emailData = payload
    }

    console.log("[Bonsamti] Processing email:", {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
    })

    if (!emailData.from || !emailData.to) {
      console.error("[Bonsamti] Invalid email payload: missing from or to fields")
      return NextResponse.json({ error: "Invalid email payload: missing required fields" }, { status: 400 })
    }

    // Normalize recipient addresses
    const recipients = normalizeEmailAddresses(emailData.to)
    let emailContent = extractEmailContent(emailData)
    
    // If we have HTML content, try to extract plain text
    if (emailData.html && !emailContent) {
      emailContent = extractPlainTextFromHtml(emailData.html)
    }
    
    // Sanitize the content
    emailContent = sanitizeEmailContent(emailContent)

    // Process each recipient
    const results = []

    for (const recipientEmail of recipients) {
      try {
        console.log("[Bonsamti] Processing email for recipient:", recipientEmail)

        // Find the account associated with this email
        const account = await database.accounts.findByEmail(recipientEmail)

        if (!account) {
          console.log("[Bonsamti] No account found for email:", recipientEmail)
          results.push({
            recipient: recipientEmail,
            status: "no_account",
            message: "No account found for this email address",
          })
          continue
        }

        // Check if account is still valid (not expired)
        const accountAge = Date.now() - new Date(account.created_at).getTime()
        const twentyFourHours = 24 * 60 * 60 * 1000

        if (accountAge > twentyFourHours) {
          console.log("[Bonsamti] Account expired for email:", recipientEmail)
          results.push({
            recipient: recipientEmail,
            status: "expired",
            message: "Account has expired (older than 24 hours)",
          })
          continue
        }

        // Store the email in the database
        const storedEmail = await database.emails.create({
          account_id: account.id,
          sender: emailData.from,
          subject: emailData.subject || "No Subject",
          body: emailContent,
          recipient: recipientEmail,
        })

        console.log("[Bonsamti] Email stored successfully:", storedEmail.id)
        results.push({
          recipient: recipientEmail,
          status: "stored",
          emailId: storedEmail.id,
          message: "Email stored successfully",
        })
      } catch (error) {
        console.error("[Bonsamti] Error processing email for recipient:", recipientEmail, error)
        results.push({
          recipient: recipientEmail,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const response = {
      success: true,
      message: "Email processed",
      results,
      processed_at: new Date().toISOString(),
    }

    console.log("[Bonsamti] Webhook processing complete:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[Bonsamti] Error processing inbound email webhook:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Inbound email webhook endpoint is active",
    endpoint: "/api/emails/inbound",
    provider: "Resend",
    domain: process.env.RESEND_DOMAIN || "bonsamti.dev",
    timestamp: new Date().toISOString(),
  })
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
