-- supabase/migrations/02_create_abilities_table.sql
-- Create the abilities table

-- Enable uuid-ossp extension if not already enabled in 00_
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.abilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  script text NOT NULL, -- The code or script to execute
  trigger jsonb, -- JSONB field for trigger configuration (e.g., { type: 'keyword', value: 'send email' })
  forged_from_actions uuid[], -- Array of user_action IDs this was forged from
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  last_used_timestamp timestamp with time zone,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- Optional: Link to user if implementing auth
  is_public boolean DEFAULT false, -- Optional: Can this ability be shared?
  version text DEFAULT '1.0' -- Optional: Versioning for abilities
);

-- Optional: Add indexes
CREATE INDEX idx_abilities_user_id ON public.abilities (user_id);
CREATE INDEX idx_abilities_creation_timestamp ON public.abilities (creation_timestamp);
-- Consider indexing trigger types or keywords if you query by them frequently
-- CREATE INDEX idx_abilities_trigger_type ON public.abilities ((trigger->>'type'));

-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policy for authenticated users to read their own abilities and public abilities
CREATE POLICY "Enable read access for authenticated users on abilities" ON public.abilities FOR SELECT USING (
  auth.role() = 'authenticated' AND (user_id = auth.uid() OR is_public = true)
);
-- Policy for authenticated users to insert their own abilities
CREATE POLICY "Enable insert for authenticated users on abilities" ON public.abilities FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Policy for authenticated users to update their own abilities
CREATE POLICY "Enable update for users who created the ability" ON public.abilities FOR UPDATE USING (auth.uid() = user_id);
-- Policy for authenticated users to delete their own abilities
CREATE POLICY "Enable delete for users who created the ability" ON public.abilities FOR DELETE USING (auth.uid() = user_id);