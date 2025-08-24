import { NextResponse } from "next/server"
import { database } from "@/lib/data"

// Admin endpoint to get system statistics
export async function GET() {
  try {
    const accountStats = await database.accounts.getStats()
    const totalEmails = await database.emails.getCount()

    const stats = {
      accounts: accountStats,
      emails: {
        total: totalEmails,
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
