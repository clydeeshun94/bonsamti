/*
  # Create Bonsamti Database Schema

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text) 
      - `email` (text, unique)
      - `password` (text)
      - `created_at` (timestamptz)
    - `emails`
      - `id` (uuid, primary key)
      - `account_id` (uuid, foreign key)
      - `sender` (text)
      - `subject` (text, nullable)
      - `body` (text, nullable)
      - `received_at` (timestamptz)
      - `recipient` (text, nullable)
      - `is_sent` (boolean, default false)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (disposable email service)

  3. Performance
    - Add indexes for email lookups and date queries
    - Enable realtime for emails table
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
    sender text NOT NULL,
    subject text,
    body text,
    received_at timestamptz DEFAULT now(),
    recipient text,
    is_sent boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no authentication required for disposable service)
CREATE POLICY "Allow public read access to accounts" 
  ON accounts FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to accounts" 
  ON accounts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to accounts" 
  ON accounts FOR DELETE 
  USING (true);

CREATE POLICY "Allow public read access to emails" 
  ON emails FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to emails" 
  ON emails FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to emails" 
  ON emails FOR DELETE 
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts(created_at);
CREATE INDEX IF NOT EXISTS idx_emails_account_id ON emails(account_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_emails_recipient ON emails(recipient);

-- Enable realtime for emails table
ALTER PUBLICATION supabase_realtime ADD TABLE emails;