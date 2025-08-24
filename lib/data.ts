import type { Account, Email } from "./types"
import { createClient } from "./supabase/server"

const demoEmails = [
  {
    sender: "noreply@github.com",
    subject: "Welcome to GitHub!",
    body: "Thanks for signing up! Your account has been created successfully. Start exploring repositories and connecting with developers worldwide.",
  },
  {
    sender: "security@facebook.com",
    subject: "Confirm your email address",
    body: "Please click the link below to verify your email address and complete your Facebook account setup.\n\nIf you didn't create this account, please ignore this email.",
  },
  {
    sender: "team@notion.so",
    subject: "Your Notion workspace is ready",
    body: "Welcome to Notion! Your workspace has been created and you can start organizing your thoughts, projects, and ideas right away.",
  },
]

export const database = {
  accounts: {
    create: async (account: Omit<Account, "id" | "created_at">): Promise<Account> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("accounts").insert(account).select().single()

      if (error) throw error

      // Add demo emails after account creation
      setTimeout(async () => {
        const supabaseClient = await createClient()
        for (let i = 0; i < demoEmails.length; i++) {
          setTimeout(
            async () => {
              await supabaseClient.from("emails").insert({
                account_id: data.id,
                sender: demoEmails[i].sender,
                subject: demoEmails[i].subject,
                body: demoEmails[i].body,
              })
            },
            (i + 1) * 2000,
          )
        }
      }, 3000)

      return data
    },

    findByEmail: async (email: string): Promise<Account | null> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("accounts").select().eq("email", email).single()

      if (error) return null
      return data
    },

    findById: async (id: string): Promise<Account | null> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("accounts").select().eq("id", id).single()

      if (error) return null
      return data
    },

    deleteOlderThan: async (hours: number): Promise<number> => {
      const supabase = await createClient()
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

      const { data: accountsToDelete } = await supabase.from("accounts").select("id").lt("created_at", cutoff)

      if (!accountsToDelete || accountsToDelete.length === 0) return 0

      const { error } = await supabase.from("accounts").delete().lt("created_at", cutoff)

      if (error) throw error
      return accountsToDelete.length
    },

    getAll: async (): Promise<Account[]> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("accounts").select().order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },

    getStats: async (): Promise<{ total: number; active: number; expired: number }> => {
      const supabase = await createClient()
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      const { data: allAccounts } = await supabase.from("accounts").select("created_at")
      const { data: activeAccounts } = await supabase
        .from("accounts")
        .select("created_at")
        .gt("created_at", twentyFourHoursAgo)

      const total = allAccounts?.length || 0
      const active = activeAccounts?.length || 0
      const expired = total - active

      return { total, active, expired }
    },
  },

  emails: {
    create: async (email: Omit<Email, "id" | "received_at">): Promise<Email> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("emails").insert(email).select().single()

      if (error) throw error
      return data
    },

    findByAccountId: async (accountId: string): Promise<Email[]> => {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("emails")
        .select()
        .eq("account_id", accountId)
        .order("received_at", { ascending: false })

      if (error) throw error
      return data || []
    },

    findById: async (id: string): Promise<Email | null> => {
      const supabase = await createClient()

      const { data, error } = await supabase.from("emails").select().eq("id", id).single()

      if (error) return null
      return data
    },

    delete: async (id: string): Promise<void> => {
      const supabase = await createClient()

      const { error } = await supabase.from("emails").delete().eq("id", id)

      if (error) throw error
    },

    deleteByAccountIds: async (accountIds: string[]): Promise<number> => {
      const supabase = await createClient()

      const { data: emailsToDelete } = await supabase.from("emails").select("id").in("account_id", accountIds)

      if (!emailsToDelete || emailsToDelete.length === 0) return 0

      const { error } = await supabase.from("emails").delete().in("account_id", accountIds)

      if (error) throw error
      return emailsToDelete.length
    },

    getCount: async (): Promise<number> => {
      const supabase = await createClient()

      const { count, error } = await supabase.from("emails").select("*", { count: "exact", head: true })

      if (error) throw error
      return count || 0
    },
  },
}
