import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/appStore";
import { Loader2, ArrowLeft, Check, Zap } from "lucide-react";

export default function IndustryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("industry_solutions")
        .select("*")
        .eq("slug", id)
        .single();

      if (data) {
        setSolution(data);
      } else {
        // Fallback
        setSolution({
          name: id?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Industry",
          slug: id,
          description: "AI-powered solutions tailored for this industry vertical. Leverage cutting-edge tools to automate workflows, reduce costs, and accelerate growth.",
          features: [
            "AI-Powered Automation", "Predictive Analytics", "Natural Language Processing",
            "Computer Vision", "Real-time Dashboards", "Custom Integrations",
            "API Access", "24/7 Support",
          ],
        });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = Array.isArray(solution?.features)
    ? solution.features
    : typeof solution?.features === "string"
    ? JSON.parse(solution.features)
    : [];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title={`${solution?.name} Solutions`} description={solution?.description} />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <Button variant="ghost" onClick={() => navigate("/industries")} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Industries
          </Button>

          <div className="max-w-4xl mx-auto animate-fade-in">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Industry Solution</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {solution?.name}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{solution?.description}</p>

            {/* Features */}
            <Card className="bg-gradient-card border-border p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <div className="p-1 bg-primary/20 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-card border-primary p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Ready to Transform Your {solution?.name} Business?
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Get access to all {solution?.name} AI tools with a single subscription.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow"
                  onClick={() => navigate("/auth")}
                >
                  <Zap className="mr-2 h-5 w-5" /> Get Started - $5.99/mo
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/tools")}>
                  View All Tools
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
