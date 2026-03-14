import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { payment_id, status, user_id } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update payment status
    const { error: paymentError } = await supabase
      .from("payments")
      .update({ status })
      .eq("id", payment_id);

    if (paymentError) throw paymentError;

    if (status === "success") {
      // Update profile payment_verified
      await supabase
        .from("profiles")
        .update({
          payment_verified: true,
          payment_id: payment_id,
          subscription_plan: "monthly",
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", user_id);

      // Create subscription
      const payment = await supabase
        .from("payments")
        .select("tool_id, amount")
        .eq("id", payment_id)
        .single();

      if (payment.data) {
        await supabase.from("subscriptions").insert({
          user_id,
          tool_id: payment.data.tool_id,
          status: "active",
          amount: payment.data.amount,
          plan_type: "monthly",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("payment-webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
