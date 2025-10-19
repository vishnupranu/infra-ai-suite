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
            <div className="inline-block animate-pulse mb-4 px-4 py-2 bg-primary/20 rounded-full border border-primary">
              <span className="text-primary font-semibold">🎉 Limited Offer: Get ₹200 OFF</span>
            </div>
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
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6 animate-pulse"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/tools")}
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
              >
                {t.hero.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">Choose the plan that works best for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="relative p-8 bg-gradient-card rounded-2xl border-2 border-border hover:border-primary transition-all hover:shadow-elevated group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">Monthly Plan</h3>
                <div className="mb-2">
                  <span className="text-3xl text-muted-foreground line-through">₹499</span>
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">₹299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-primary font-semibold mt-2">Save ₹200 with code SAVE200</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Access to 1000+ AI Tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Instant activation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Secure UPI payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Referral earnings</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                size="lg"
              >
                Get Started Now
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="relative p-8 bg-gradient-card rounded-2xl border-2 border-primary hover:shadow-glow transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">Yearly Plan</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-bold text-primary">₹9,999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-primary font-semibold">Save ₹2,989 per year!</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Everything in Monthly, plus:</span>
                </li>
                <li className="flex items-center gap-2 pl-6">
                  <span>💎 Priority support</span>
                </li>
                <li className="flex items-center gap-2 pl-6">
                  <span>🚀 VPS deployment access</span>
                </li>
                <li className="flex items-center gap-2 pl-6">
                  <span>📦 Open source code access</span>
                </li>
                <li className="flex items-center gap-2 pl-6">
                  <span>🎯 Advanced analytics</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all animate-pulse"
                size="lg"
              >
                Get Yearly Access
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm">✅ Instant Activation</span>
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm">✅ Cancel Anytime</span>
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm">✅ 24/7 Support</span>
              <span className="px-4 py-2 bg-primary/10 rounded-full text-sm">✅ Regular Updates</span>
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