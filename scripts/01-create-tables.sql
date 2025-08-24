-- Bonsamti Database Schema
-- Table for storing generated accounts
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Strong, randomly generated password
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table for storing all incoming emails
CREATE TABLE IF NOT EXISTS emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security with public access policies since this is a disposable service
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Public access policies for disposable email service (no authentication required)
CREATE POLICY "Allow public read access to accounts" ON accounts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to accounts" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access to accounts" ON accounts FOR DELETE USING (true);

CREATE POLICY "Allow public read access to emails" ON emails FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to emails" ON emails FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access to emails" ON emails FOR DELETE USING (true);

-- Enable realtime for the emails table
ALTER PUBLICATION supabase_realtime ADD TABLE emails;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts(created_at);
CREATE INDEX IF NOT EXISTS idx_emails_account_id ON emails(account_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
