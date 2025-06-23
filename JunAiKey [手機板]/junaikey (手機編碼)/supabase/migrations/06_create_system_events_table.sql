-- supabase/migrations/06_create_system_events_table.sql
-- Create the system_events table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.system_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  type text NOT NULL, -- e.g., 'task_completed', 'ability_forged', 'rune_installed', 'data_synced'
  payload jsonb, -- Event-specific data
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL, -- Optional: User associated with the event
  context jsonb, -- Optional: Contextual information
  severity text -- Optional: 'info', 'warning', 'error'
);

-- Add indexes
CREATE INDEX idx_system_events_timestamp ON public.system_events (timestamp);
CREATE INDEX idx_system_events_type ON public.system_events (type);
CREATE INDEX idx_system_events_user_id ON public.system_events (user_id);

-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- System events might be readable by admins or the user associated with the event.
CREATE POLICY "Enable read access for users on their associated events" ON public.system_events FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Enable read access for admins on all events" ON public.system_events FOR SELECT USING (auth.role() = 'admin'); -- Requires role implementation
-- Insert might be restricted to backend/Edge Functions using service_role key or specific policies.