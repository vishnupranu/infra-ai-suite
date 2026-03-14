import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/appStore";
import { Loader2, ArrowRight, ShoppingCart, Heart, DollarSign, GraduationCap, Factory, Building } from "lucide-react";

const iconMap: Record<string, any> = {
  ShoppingCart, Heart, DollarSign, GraduationCap, Factory, Building,
};

export default function Industries() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any).from("industry_solutions").select("*").order("name");
      setSolutions(data || []);
      setLoading(false);
    };
    load();
  }, []);

  // Fallback data
  const fallbackSolutions = [
    { id: "1", name: "E-Commerce", slug: "e-commerce", description: "AI-powered product recommendations, inventory management, and customer service.", icon_name: "ShoppingCart", features: ["Product Recommendations", "Dynamic Pricing", "Chatbot Support"] },
    { id: "2", name: "Healthcare", slug: "healthcare", description: "HIPAA-compliant AI tools for diagnostics and patient management.", icon_name: "Heart", features: ["Medical Imaging AI", "Patient Triage", "Drug Discovery"] },
    { id: "3", name: "Finance", slug: "finance", description: "AI solutions for fraud detection, algorithmic trading, and risk assessment.", icon_name: "DollarSign", features: ["Fraud Detection", "Algorithmic Trading", "Risk Assessment"] },
    { id: "4", name: "Education", slug: "education", description: "Personalized learning platforms and intelligent tutoring systems.", icon_name: "GraduationCap", features: ["Adaptive Learning", "Auto Grading", "Content Generation"] },
    { id: "5", name: "Manufacturing", slug: "manufacturing", description: "Predictive maintenance and supply chain optimization.", icon_name: "Factory", features: ["Predictive Maintenance", "Quality Inspection", "Digital Twin"] },
    { id: "6", name: "Real Estate", slug: "real-estate", description: "Property valuation and virtual staging powered by AI.", icon_name: "Building", features: ["Property Valuation", "Virtual Staging", "Market Prediction"] },
  ];

  const displaySolutions = solutions.length > 0 ? solutions : fallbackSolutions;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Industry Solutions" description="AI solutions tailored for every industry" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Industry Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored AI solutions for every industry. Find tools specific to your business needs.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displaySolutions.map((solution, index) => {
                const Icon = iconMap[solution.icon_name] || ShoppingCart;
                const features = Array.isArray(solution.features)
                  ? solution.features
                  : typeof solution.features === "string"
                  ? JSON.parse(solution.features)
                  : [];

                return (
                  <Card
                    key={solution.id}
                    className="group p-6 bg-gradient-card border-border hover:border-primary transition-all hover:shadow-glow hover:-translate-y-1 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate(`/industries/${solution.slug}`)}
                  >
                    <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{solution.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{solution.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {features.slice(0, 3).map((f: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                    </div>
                    <Button variant="ghost" className="group-hover:text-primary p-0">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
