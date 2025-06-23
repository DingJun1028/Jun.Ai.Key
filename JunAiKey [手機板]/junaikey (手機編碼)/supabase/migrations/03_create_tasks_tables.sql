-- supabase/migrations/03_create_tasks_tables.sql
-- Create the tasks and task_steps tables

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'failed', 'paused', 'cancelled'
  current_step_index integer NOT NULL DEFAULT 0, -- Index of the current step being executed
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  start_timestamp timestamp with time zone,
  completion_timestamp timestamp with time zone,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE -- Optional: Link to user if implementing auth
  -- TODO: Add schedule, priority, recurrence, linked_goal_id
);

-- Create the task_steps table
CREATE TABLE public.task_steps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES public.tasks (id) ON DELETE CASCADE NOT NULL, -- Link to the parent task
  step_order integer NOT NULL, -- Order of the step within the task
  description text NOT NULL,
  action jsonb NOT NULL, -- JSONB field for action configuration (e.g., { type: 'callAPI', details: { url: '...', method: '...' } })
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'failed'
  result jsonb, -- Result of the action
  error text, -- Error message if failed
  start_timestamp timestamp with time zone,
  end_timestamp timestamp with time zone
  -- TODO: Add retry configuration, dependencies on other steps
);

-- Add indexes
CREATE INDEX idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX idx_tasks_status ON public.tasks (status);
CREATE INDEX idx_tasks_creation_timestamp ON public.tasks (creation_timestamp);
CREATE INDEX idx_task_steps_task_id ON public.task_steps (task_id);
CREATE INDEX idx_task_steps_step_order ON public.task_steps (step_order);

-- Ensure step_order is unique within a task
ALTER TABLE public.task_steps ADD CONSTRAINT unique_step_order_per_task UNIQUE (task_id, step_order);


-- Optional: Set up Row Level Security (RLS) for tasks and task_steps
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_steps ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policies for tasks (similar to knowledge_records and abilities)
CREATE POLICY "Enable read access for authenticated users on tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users who created the task" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users who created the task" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Policies for task_steps (should be linked to task RLS)
CREATE POLICY "Enable read access for authenticated users on task_steps" ON public.task_steps FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.tasks WHERE id = task_id)
);
CREATE POLICY "Enable insert for authenticated users on task_steps" ON public.task_steps FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM public.tasks WHERE id = task_id)
);
CREATE POLICY "Enable update for users on their own parent task" ON public.task_steps FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM public.tasks WHERE id = task_id)
);
CREATE POLICY "Enable delete for users on their own parent task" ON public.task_steps FOR DELETE USING (
  auth.uid() = (SELECT user_id FROM public.tasks WHERE id = task_id)
);