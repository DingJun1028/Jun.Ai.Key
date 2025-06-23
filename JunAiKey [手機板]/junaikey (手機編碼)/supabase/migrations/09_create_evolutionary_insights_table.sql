-- supabase/migrations/09_create_evolutionary_insights_table.sql
-- Create the evolutionary_insights table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.evolutionary_insights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  type text NOT NULL, -- 'automation_opportunity', 'task_failure_diagnosis', 'skill_suggestion', 'optimization_recommendation', 'scripting_app_suggestion', 'dev_workflow_suggestion'
  details jsonb, -- Specific details about the insight (e.g., pattern, diagnosis, suggested capability definition)
  dismissed boolean DEFAULT false NOT NULL -- Flag to indicate if the user has dismissed this insight
);

-- Add indexes
CREATE INDEX idx_evolutionary_insights_user_id ON public.evolutionary_insights (user_id);
CREATE INDEX idx_evolutionary_insights_timestamp ON public.evolutionary_insights (timestamp);
CREATE INDEX idx_evolutionary_insights_type ON public.evolutionary_insights (type);
CREATE INDEX idx_evolutionary_insights_dismissed ON public.evolutionary_insights (dismissed);


-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.evolutionary_insights ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/update/delete their own insights.
CREATE POLICY "Enable read access for users on their own insights" ON public.evolutionary_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own insights" ON public.evolutionary_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Allow users to update the 'dismissed' flag on their own insights
CREATE POLICY "Enable update for users on their own insights" ON public.evolutionary_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own insights" ON public.evolutionary_insights FOR DELETE USING (auth.uid() = user_id);