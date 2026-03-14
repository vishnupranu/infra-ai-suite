import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { period = "24h" } = await req.json();

    const hours = period === "7d" ? 168 : period === "30d" ? 720 : 24;

    const traffic = Array.from({ length: Math.min(hours, 24) }, (_, i) => ({
      hour: `${i}:00`,
      requests: Math.floor(50 + Math.random() * 300),
      errors: Math.floor(Math.random() * 15),
      latency: Math.floor(50 + Math.random() * 200),
    }));

    const metrics = {
      cpu: 15 + Math.random() * 50,
      memory: 30 + Math.random() * 45,
      disk: 20 + Math.random() * 30,
      requests_total: Math.floor(10000 + Math.random() * 50000),
      error_rate: Math.random() * 5,
      avg_latency: Math.floor(80 + Math.random() * 120),
      uptime: 99.9 + Math.random() * 0.09,
    };

    return new Response(JSON.stringify({ traffic, metrics }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
