export interface Account {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  created_at: string
}

export interface Email {
  id: string
  account_id: string
  sender: string
  subject: string | null
  body: string | null
  received_at: string
  recipient?: string
  is_sent?: boolean
}

export interface GenerateIdentityRequest {
  firstName?: string
  lastName?: string
  useCustomName: boolean
}

export interface ComposeEmailRequest {
  to: string
  subject: string
  body: string
}
