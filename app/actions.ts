"use server"

import { database } from "@/lib/data"
import { generateRandomName, generateEmail, generateStrongPassword } from "@/lib/utils/generators"
import type { Account, GenerateIdentityRequest } from "@/lib/types"

export async function generateIdentity(request: GenerateIdentityRequest): Promise<{
  success: boolean
  account?: Account
  error?: string
}> {
  try {
    let firstName: string
    let lastName: string

    if (request.useCustomName && request.firstName && request.lastName) {
      firstName = request.firstName.trim()
      lastName = request.lastName.trim()

      if (!firstName || !lastName) {
        return {
          success: false,
          error: "Both first name and last name are required when using custom names",
        }
      }
    } else {
      const randomName = generateRandomName()
      firstName = randomName.firstName
      lastName = randomName.lastName
    }

    // Generate email and check for uniqueness
    let email: string
    let attempts = 0
    const maxAttempts = 10

    do {
      email = generateEmail(firstName, lastName)
      const existingAccount = await database.accounts.findByEmail(email)

      if (!existingAccount) {
        break
      }

      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      return {
        success: false,
        error: "Unable to generate unique email address. Please try again.",
      }
    }

    // Generate strong password
    const password = generateStrongPassword()

    // Create account
    const account = await database.accounts.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    })

    return {
      success: true,
      account,
    }
  } catch (error) {
    console.error("Error generating identity:", error)
    return {
      success: false,
      error: "Failed to generate identity. Please try again.",
    }
  }
}

export async function getAccountEmails(accountId: string): Promise<{
  success: boolean
  emails?: Array<{
    id: string
    sender: string
    subject: string | null
    body: string | null
    received_at: string
  }>
  error?: string
}> {
  try {
    const emails = await database.emails.findByAccountId(accountId)

    return {
      success: true,
      emails: emails.map((email) => ({
        id: email.id,
        sender: email.sender,
        subject: email.subject,
        body: email.body,
        received_at: email.received_at,
      })),
    }
  } catch (error) {
    console.error("Error fetching emails:", error)
    return {
      success: false,
      error: "Failed to fetch emails",
    }
  }
}

export async function cleanupOldAccounts(): Promise<{
  success: boolean
  deletedAccounts?: number
  deletedEmails?: number
  error?: string
}> {
  try {
    // Delete accounts older than 24 hours
    const deletedAccounts = await database.accounts.deleteOlderThan(24)

    // Note: Emails are automatically deleted via CASCADE in real database
    return {
      success: true,
      deletedAccounts,
      deletedEmails: 0, // CASCADE handles email deletion
    }
  } catch (error) {
    console.error("Error cleaning up old accounts:", error)
    return {
      success: false,
      error: "Failed to cleanup old accounts",
    }
  }
}

export async function sendEmail(request: {
  fromAccountId: string
  to: string
  subject: string
  body: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Verify the sender account exists and is not expired
    const senderAccount = await database.accounts.findById(request.fromAccountId)
    if (!senderAccount) {
      return {
        success: false,
        error: "Sender account not found or expired",
      }
    }

    // For now, we'll store sent emails as regular emails in the system
    // In a real implementation, this would integrate with an email service like Resend
    const sentEmail = await database.emails.create({
      account_id: request.fromAccountId,
      sender: senderAccount.email,
      recipient: request.to,
      subject: request.subject,
      body: request.body,
      is_sent: true, // Mark as sent email
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: "Failed to send email. Please try again.",
    }
  }
}

export async function deleteEmail(
  emailId: string,
  accountId: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Verify the email belongs to the account
    const email = await database.emails.findById(emailId)
    if (!email || email.account_id !== accountId) {
      return {
        success: false,
        error: "Email not found or access denied",
      }
    }

    await database.emails.delete(emailId)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting email:", error)
    return {
      success: false,
      error: "Failed to delete email",
    }
  }
}
