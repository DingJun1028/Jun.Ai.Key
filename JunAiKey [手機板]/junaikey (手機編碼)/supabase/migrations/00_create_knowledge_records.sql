-- supabase/migrations/00_create_knowledge_records.sql
-- Create the knowledge_records table

-- Enable uuid-ossp extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.knowledge_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  -- Optional: Add a user_id column if you implement authentication
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE -- Link to user if implementing auth
);

-- Optional: Add indexes for better query performance
CREATE INDEX idx_knowledge_records_timestamp ON public.knowledge_records (timestamp);
-- Add a full-text search index on the question column
CREATE INDEX idx_knowledge_records_question_fts ON public.knowledge_records USING GIN (to_tsvector('english', question));
-- Add a full-text search index on the answer column (optional)
-- CREATE INDEX idx_knowledge_records_answer_fts ON public.knowledge_records USING GIN (to_tsvector('english', answer));


-- Optional: Set up Row Level Security (RLS)
-- Enable RLS for this table
ALTER TABLE public.knowledge_records ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policy for authenticated users to read their own records
CREATE POLICY "Enable read access for authenticated users on their own records" ON public.knowledge_records FOR SELECT USING (
  auth.role() = 'authenticated' AND user_id = auth.uid()
);
-- Policy for authenticated users to insert their own records
CREATE POLICY "Enable insert for authenticated users" ON public.knowledge_records FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Policy for authenticated users to update their own records
CREATE POLICY "Enable update for users who created the record" ON public.knowledge_records FOR UPDATE USING (auth.uid() = user_id);
-- Policy for authenticated users to delete their own records
CREATE POLICY "Enable delete for users who created the record" ON public.knowledge_records FOR DELETE USING (auth.uid() = user_id);

-- Optional: Policy for public read access (if some records are public)
-- CREATE POLICY "Enable public read access" ON public.knowledge_records FOR SELECT USING (user_id IS NULL); -- Requires a column to mark public records