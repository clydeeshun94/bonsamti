import { NextResponse } from "next/server"
import { database } from "@/lib/data"

// Cleanup job to remove accounts and emails older than 24 hours
export async function GET() {
  try {
    console.log("[v0] Starting cleanup job...")

    const deletedAccountsCount = await database.accounts.deleteOlderThan(24)

    const deletedEmailsCount = 0 // CASCADE handles email deletion

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      deletedAccounts: deletedAccountsCount,
      deletedEmails: deletedEmailsCount,
      message: `Cleanup completed: ${deletedAccountsCount} accounts and associated emails removed`,
    }

    console.log("[v0] Cleanup job completed:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cleanup job failed:", error)

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: "Cleanup job failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Manual cleanup endpoint (for testing)
export async function POST() {
  try {
    console.log("[v0] Manual cleanup triggered...")

    const deletedAccountsCount = await database.accounts.deleteOlderThan(24)
    const deletedEmailsCount = 0 // CASCADE handles email deletion

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      deletedAccounts: deletedAccountsCount,
      deletedEmails: deletedEmailsCount,
      message: `Manual cleanup completed: ${deletedAccountsCount} accounts and associated emails removed`,
      trigger: "manual",
    }

    console.log("[v0] Manual cleanup completed:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Manual cleanup failed:", error)

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: "Manual cleanup failed",
        message: error instanceof Error ? error.message : "Unknown error",
        trigger: "manual",
      },
      { status: 500 },
    )
  }
}
