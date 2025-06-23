-- supabase/migrations/08_create_goals_tables.sql
-- Create the goals and key_results tables

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user
  description text NOT NULL, -- The main objective
  type text NOT NULL, -- 'smart' | 'okr'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'cancelled'
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  target_completion_date date -- For SMART (Time-bound)
  -- TODO: Add metrics, progress tracking fields, parent_goal_id for nested goals
);

-- Create the key_results table (for OKRs)
CREATE TABLE public.key_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id uuid REFERENCES public.goals (id) ON DELETE CASCADE NOT NULL, -- Link to the parent goal
  description text NOT NULL, -- The measurable result
  target_value numeric, -- Target value (can be number, percentage, etc.)
  current_value numeric DEFAULT 0, -- Current value
  unit text, -- e.g., 'count', 'percentage', 'dollars'
  status text NOT NULL DEFAULT 'on-track' -- 'on-track', 'at-risk', 'completed'
  -- TODO: Link to specific tasks or actions that contribute to this KR (e.g., contributing_task_ids uuid[])
);

-- Add indexes
CREATE INDEX idx_goals_user_id ON public.goals (user_id);
CREATE INDEX idx_goals_status ON public.goals (status);
CREATE INDEX idx_goals_creation_timestamp ON public.goals (creation_timestamp);
CREATE INDEX idx_key_results_goal_id ON public.key_results (goal_id);
CREATE INDEX idx_key_results_status ON public.key_results (status);

-- Optional: Set up Row Level Security (RLS) for goals and key_results
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_results ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/manage their own goals and key results.
CREATE POLICY "Enable read access for users on their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users on their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Policies for key_results (should be linked to goal RLS)
CREATE POLICY "Enable read access for users on key results of their goals" ON public.key_results FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id)
);
CREATE POLICY "Enable insert for authenticated users on key results of their goals" ON public.key_results FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id)
);
CREATE POLICY "Enable update for users on key results of their goals" ON public.key_results FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id)
);
CREATE POLICY "Enable delete for users on key results of their goals" ON public.key_results FOR DELETE USING (
  auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id)
);