-- supabase/migrations/07_create_notifications_table.sql
-- Create the notifications table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- Target user (required for user notifications)
  type text NOT NULL, -- 'info', 'warning', 'error', 'success'
  message text NOT NULL,
  details jsonb, -- Optional details
  is_read boolean DEFAULT false NOT NULL,
  channel text NOT NULL DEFAULT 'ui' -- 'ui', 'email', 'webhook', 'push'
  -- TODO: Add action_link, icon, expiry_timestamp
);

-- Add indexes
CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_timestamp ON public.notifications (timestamp);
CREATE INDEX idx_notifications_is_read ON public.notifications (is_read);

-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/update/delete their own notifications.
CREATE POLICY "Enable read access for users on their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users on their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);