-- supabase/migrations/01_create_notification_trigger.sql
-- Create a trigger to notify on new knowledge_records inserts

-- First, create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_knowledge_record()
RETURNS TRIGGER AS $$
BEGIN
  -- This function is triggered AFTER an INSERT on knowledge_records.
  -- It can be used to perform actions like:
  -- 1. Sending a notification (e.g., via a webhook or another service).
  -- 2. Inserting a message into a queue table for processing by an Edge Function.
  -- 3. Logging the event.

  -- For this MVP, we'll log the event and assume an Edge Function
  -- is listening for Realtime changes or processing a queue.

  RAISE NOTICE 'Triggered: New knowledge record inserted with ID %', NEW.id;

  -- Example: Insert into a hypothetical 'event_queue' table
  -- INSERT INTO public.event_queue (event_type, payload)
  -- VALUES ('new_knowledge_record', json_build_object('record_id', NEW.id, 'question', NEW.question, 'answer', NEW.answer));

  -- Example: Call an Edge Function directly (requires http extension and careful security)
  -- SELECT http_post(
  --   'https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/functions/v1/trigger_notification',
  --   json_build_object('record', NEW)::text,
  --   'application/json'::text
  -- );

  -- For MVP, the Edge Function `trigger_notification` is designed to
  -- be called externally (e.g., by a webhook service subscribed to DB changes)
  -- or to subscribe to Realtime changes itself.
  -- The trigger function itself doesn't need to call the Edge Function directly in this setup.

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER allows the function to run with elevated privileges if needed

-- Then, create the trigger
-- This trigger fires after a new row is inserted into the knowledge_records table.
CREATE TRIGGER on_knowledge_record_insert
AFTER INSERT ON public.knowledge_records
FOR EACH ROW EXECUTE FUNCTION public.handle_new_knowledge_record();

-- Optional: Grant execution to the anon role if the trigger function needs to be callable by anon (less common)
-- GRANT EXECUTE ON FUNCTION public.handle_new_knowledge_record() TO anon;