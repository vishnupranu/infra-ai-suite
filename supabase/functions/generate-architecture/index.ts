import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a cloud architecture expert. Generate production-ready architecture designs as JSON. 
            Always respond with valid JSON containing: services, databases, security, costs, topology arrays.
            Each service has: name, type, description.
            Each database has: name, type, purpose.
            Each security layer has: layer, description.
            Each cost has: item, monthly (number), yearly (number).
            Each topology item has: component, provider, tier.`,
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_architecture",
              description: "Generate a cloud architecture design",
              parameters: {
                type: "object",
                properties: {
                  services: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["name", "type", "description"],
                    },
                  },
                  databases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        purpose: { type: "string" },
                      },
                      required: ["name", "type", "purpose"],
                    },
                  },
                  security: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        layer: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["layer", "description"],
                    },
                  },
                  costs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        item: { type: "string" },
                        monthly: { type: "number" },
                        yearly: { type: "number" },
                      },
                      required: ["item", "monthly", "yearly"],
                    },
                  },
                  topology: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        component: { type: "string" },
                        provider: { type: "string" },
                        tier: { type: "string" },
                      },
                      required: ["component", "provider", "tier"],
                    },
                  },
                },
                required: ["services", "databases", "security", "costs", "topology"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_architecture" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const architecture = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(architecture), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse from content
    const content = data.choices?.[0]?.message?.content || "{}";
    return new Response(content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-architecture error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
