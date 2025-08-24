import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/data"

// Test endpoint to simulate receiving an email (for development/testing)
export async function POST(request: NextRequest) {
  try {
    const { accountEmail, from, subject, body } = await request.json()

    if (!accountEmail || !from) {
      return NextResponse.json({ error: "Missing required fields: accountEmail, from" }, { status: 400 })
    }

    // Find the account
    const account = await database.accounts.findByEmail(accountEmail)

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Check if account is still valid
    const accountAge = Date.now() - new Date(account.created_at).getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (accountAge > twentyFourHours) {
      return NextResponse.json({ error: "Account expired" }, { status: 410 })
    }

    // Create the email
    const email = await database.emails.create({
      account_id: account.id,
      sender: from,
      subject: subject || "Test Email",
      body: body || "This is a test email sent via the API.",
    })

    return NextResponse.json({
      success: true,
      message: "Test email created",
      email: {
        id: email.id,
        sender: email.sender,
        subject: email.subject,
        received_at: email.received_at,
      },
    })
  } catch (error) {
    console.error("Error creating test email:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
