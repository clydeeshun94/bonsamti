import { createClient } from "@supabase/supabase-js"

// Public client for operations that don't require authentication
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)