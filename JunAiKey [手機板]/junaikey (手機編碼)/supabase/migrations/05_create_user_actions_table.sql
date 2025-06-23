-- supabase/migrations/05_create_user_actions_table.sql
-- Create the user_actions table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.user_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL, -- Optional: Link to user if implementing auth
  type text NOT NULL, -- e.g., 'gui:click', 'cli:command', 'api:call', 'task:execute', 'kb:save', 'ability:run'
  details jsonb, -- Specific details of the action (e.g., element ID, command string, API endpoint, taskId, recordId, abilityId)
  context jsonb -- Contextual information (e.g., app name, URL, session ID, platform: 'cli' | 'web' | 'mobile')
  -- TODO: Add duration, success/failure status
);

-- Add indexes
CREATE INDEX idx_user_actions_user_id ON public.user_actions (user_id);
CREATE INDEX idx_user_actions_timestamp ON public.user_actions (timestamp);
CREATE INDEX idx_user_actions_type ON public.user_actions (type);

-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should typically only be able to read/insert their own actions.
CREATE POLICY "Enable read access for users on their own actions" ON public.user_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own actions" ON public.user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Note: Updates and Deletes on historical actions might be restricted or disallowed.