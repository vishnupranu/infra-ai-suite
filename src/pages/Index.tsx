import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AIToolCard } from "@/components/AIToolCard";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [language, setLanguage] = useState("english");
  const [featuredTools, setFeaturedTools] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedTools();
  }, []);

  const fetchFeaturedTools = async () => {
    const { data } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("is_featured", true)
      .limit(6);
    
    setFeaturedTools(data || []);
  };

  const translations = {
    english: {
      hero: {
        title: "One Platform. 1000+ AI Tools.",
        subtitle: "Supercharge your productivity with the ultimate AI marketplace",
        cta: "Explore Tools",
        ctaSecondary: "Get Started",
      },
      features: {
        title: "Why Choose APPAIETECH?",
        items: [
          { icon: Sparkles, title: "Curated Selection", desc: "Hand-picked AI tools for every need" },
          { icon: TrendingUp, title: "Earn with Referrals", desc: "Get credits for every user you refer" },
          { icon: Shield, title: "Secure Payments", desc: "UPI, GPay, PhonePe integration" },
          { icon: Zap, title: "Instant Access", desc: "Start using tools immediately" },
        ],
      },
      featured: {
        title: "Featured AI Tools",
        subtitle: "Discover the most popular AI solutions",
      },
    },
    telugu: {
      hero: {
        title: "ఒక ప్లాట్‌ఫారమ్. 1000+ AI టూల్స్.",
        subtitle: "అత్యుత్తమ AI మార్కెట్‌ప్లేస్‌తో మీ ఉత్పాదకతను పెంచుకోండి",
        cta: "టూల్స్ అన్వేషించండి",
        ctaSecondary: "ప్రారంభించండి",
      },
      features: {
        title: "APPAIETECH ఎందుకు ఎంచుకోవాలి?",
        items: [
          { icon: Sparkles, title: "క్యూరేటెడ్ ఎంపిక", desc: "ప్రతి అవసరానికి హస్తచేసిన AI టూల్స్" },
          { icon: TrendingUp, title: "రెఫరల్స్‌తో సంపాదించండి", desc: "మీరు సూచించే ప్రతి యూజర్‌కు క్రెడిట్లు పొందండి" },
          { icon: Shield, title: "సురక్షిత చెల్లింపులు", desc: "UPI, GPay, PhonePe ఇంటిగ్రేషన్" },
          { icon: Zap, title: "తక్షణ యాక్సెస్", desc: "వెంటనే టూల్స్ ఉపయోగించడం ప్రారంభించండి" },
        ],
      },
      featured: {
        title: "ఫీచర్డ్ AI టూల్స్",
        subtitle: "అత్యంత ప్రజాదరణ పొందిన AI పరిష్కారాలను కనుగొనండి",
      },
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} setLanguage={setLanguage} />
      
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.95)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate("/tools")}
                className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6"
              >
                {t.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                {t.hero.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-primary bg-clip-text text-transparent">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-gradient-card rounded-xl border border-border hover:border-primary transition-all hover:shadow-elevated group"
                >
                  <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                {t.featured.title}
              </h2>
              <p className="text-xl text-muted-foreground">{t.featured.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredTools.map((tool) => (
                <AIToolCard key={tool.id} {...tool} />
              ))}
            </div>
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate("/tools")}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                View All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}