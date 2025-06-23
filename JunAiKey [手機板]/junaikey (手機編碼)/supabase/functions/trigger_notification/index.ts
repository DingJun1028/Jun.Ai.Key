// supabase/functions/trigger_notification/index.ts
// Supabase Edge Function to handle notifications triggered by new knowledge records.
// This function can be invoked via:
// 1. A webhook service subscribed to Supabase DB changes.
// 2. A direct HTTP call (less common from DB trigger, more common from other services).
// 3. Subscribing to Supabase Realtime changes within the function itself (requires a persistent function runner).

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { corsHeaders } from '../_shared/cors.ts'; // Assuming you have a cors helper

console.log('Notification Edge Function started.');

// Initialize Supabase client with Service Role Key (for backend operations)
// WARNING: Ensure SERVICE_ROLE_KEY is passed securely as an environment variable
const supabaseServiceRoleClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
    },
  }
);

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Authentication/Authorization (Optional but Recommended)
  // You might want to check for a specific API key or JWT token
  // const authHeader = req.headers.get('Authorization');
  // if (!authHeader || authHeader !== `Bearer ${Deno.env.get('NOTIFICATION_WEBHOOK_KEY')}`) {
  //    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
  //      status: 401,
  //      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  //    });
  // }


  try {
    // Assuming the payload contains the new record data
    // If triggered by a Supabase webhook, the structure will be specific to webhooks.
    // If triggered by a direct call, the structure depends on the caller.
    // For this example, we assume a simple JSON body with a 'record' key.
    const { record } = await req.json();

    if (!record || !record.id || !record.question || !record.answer) {
      return new Response(JSON.stringify({ error: 'Invalid payload structure. Expected { record: { id, question, answer, ... } }' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Received new knowledge record for notification:', record.id);

    // --- Implement Notification Logic Here ---
    // This could be:
    // 1. Sending a push notification (e.g., via a service like OneSignal, Expo, etc.)
    // 2. Sending an email (e.g., via SendGrid, Resend)
    // 3. Sending a message to a chat platform (e.g., Slack, Discord webhook)
    // 4. Triggering another workflow (e.g., via Boost.Space webhook as per spec)

    console.log(`Simulating sending notification for record: ${record.id}`);
    console.log(`Question: ${record.question}`);
    console.log(`Answer: ${record.answer}`);

    // Example: Call Boost.Space webhook (replace with actual Boost.Space endpoint and key)
    const boostSpaceWebhookUrl = Deno.env.get('BOOST_SPACE_WEBHOOK_URL'); // Get from Edge Function env vars
    const boostSpaceApiKey = Deno.env.get('BOOST_SPACE_API_KEY'); // Get from Edge Function env vars

    if (boostSpaceWebhookUrl && boostSpaceApiKey) {
        try {
            const boostResponse = await fetch(boostSpaceWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${boostSpaceApiKey}` // Or whatever auth Boost.Space uses
                },
                body: JSON.stringify({
                    event: 'new_knowledge_record',
                    payload: record,
                    message: `New knowledge added: "${record.question}"`
                })
            });

            if (!boostResponse.ok) {
                console.error('Boost.Space webhook failed:', boostResponse.status, boostResponse.statusText);
                // Log the error but don't necessarily fail the Edge Function
            } else {
                console.log('Boost.Space webhook triggered successfully.');
            }
        } catch (webhookError) {
            console.error('Error calling Boost.Space webhook:', webhookError);
        }
    } else {
        console.warn('BOOST_SPACE_WEBHOOK_URL or BOOST_SPACE_API_KEY not set in Edge Function secrets. Skipping Boost.Space notification.');
    }


    // --- End Notification Logic ---

    return new Response(JSON.stringify({ message: 'Notification processed successfully', recordId: record.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error processing notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper for CORS headers (create this file at supabase/functions/_shared/cors.ts)
/*
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or restrict to your frontend origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
*/