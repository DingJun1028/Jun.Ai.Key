-- supabase/migrations/04_create_runes_table.sql
-- Create the runes table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.runes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  type text NOT NULL, -- 'api-adapter', 'script-plugin', 'ui-component', 'data-source', 'automation-tool', 'ai-agent' (New type)
  manifest jsonb NOT NULL, -- Configuration/metadata (e.g., available actions, required params)
  implementation jsonb, -- Or potentially store implementation details elsewhere (e.g., code in storage, config for external service)
  version text NOT NULL,
  author_id uuid REFERENCES auth.users (id) ON DELETE SET NULL, -- Optional: Link to community author
  installation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  is_enabled boolean DEFAULT true NOT NULL, -- Can be enabled/disabled by user
  configuration jsonb, -- User-specific configuration (e.g., API keys, credentials - store securely!)
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- Optional: Link to user if this is a user-specific rune
  -- TODO: Add rating, tags, installation_count, permissions
  CONSTRAINT unique_rune_name_version UNIQUE (name, version) -- Ensure unique name/version combination
);

-- Optional: Add indexes
CREATE INDEX idx_runes_type ON public.runes (type);
CREATE INDEX idx_runes_author_id ON public.runes (author_id);
CREATE INDEX idx_runes_is_enabled ON public.runes (is_enabled);
CREATE INDEX idx_runes_user_id ON public.runes (user_id);


-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.runes ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policy for authenticated users to read their own runes and public runes
CREATE POLICY "Enable read access for authenticated users on runes" ON public.runes FOR SELECT USING (
  auth.role() = 'authenticated' AND (user_id = auth.uid() OR is_public = true)
);
-- Policy for authenticated users to insert their own runes
CREATE POLICY "Enable insert for authenticated users on their own runes" ON public.runes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Policy for authenticated users to update their own runes
CREATE POLICY "Enable update for users who created the rune" ON public.runes FOR UPDATE USING (auth.uid() = user_id);
-- Policy for authenticated users to delete their own runes
CREATE POLICY "Enable delete for users who created the rune" ON public.runes FOR DELETE USING (auth.uid() = user_id);