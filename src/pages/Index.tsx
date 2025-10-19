import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  Zap,
  Rocket,
  Code,
  Database,
  Globe,
  Brain,
  Bot,
  Workflow,
  Check,
  DollarSign,
  Clock,
  Users,
  Shield,
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export default function Index() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english");

  const translations = {
    english: {
      hero: {
        badge: "🚀 Limited Time Offer",
        title: "Build $10,000 Worth Apps in 10 Minutes",
        subtitle: "One Platform. 1000+ AI Tools. Unlimited Possibilities.",
        description: "Stop paying for multiple AI subscriptions. Access ChatGPT, Midjourney, Claude, Gemini & 1000+ tools with ONE subscription.",
        cta: "Start Your Journey - $5.99/mo",
        secondaryCta: "View All Tools",
      },
      features: {
        title: "Everything You Need to Build AI-Powered Apps",
        subtitle: "From Idea to Deployment in Minutes, Not Months",
      },
      pricing: {
        title: "Simple, Transparent Pricing",
        monthly: "Monthly",
        yearly: "Yearly",
        save: "BEST VALUE",
      },
      benefits: [
        "1000+ AI Tools Access",
        "N8N Workflow Automation",
        "AI Agent Development",
        "Text-to-App Generation",
        "Backend + Frontend + DB",
        "One-Click Deployment",
        "Open Source Code",
        "VPS Deployment Guide",
      ],
    },
    telugu: {
      hero: {
        badge: "🚀 పరిమిత సమయం ఆఫర్",
        title: "10 నిమిషాల్లో $10,000 విలువైన యాప్‌లను రూపొందించండి",
        subtitle: "ఒక ప్లాట్‌ఫారం. 1000+ AI టూల్స్. అపరిమిత అవకాశాలు.",
        description: "బహుళ AI చందాలను చెల్లించడం ఆపండి. ChatGPT, Midjourney, Claude, Gemini & 1000+ టూల్స్‌ను ఒక్క చందాతో యాక్సెస్ చేయండి.",
        cta: "మీ ప్రయాణాన్ని ప్రారంభించండి - $5.99/నెల",
        secondaryCta: "అన్ని టూల్స్ చూడండి",
      },
      features: {
        title: "AI-ఆధారిత యాప్‌లను రూపొందించడానికి మీకు కావలసినవన్నీ",
        subtitle: "ఆలోచన నుండి విస్తరణ వరకు నిమిషాల్లో, నెలల్లో కాదు",
      },
      pricing: {
        title: "సరళమైన, పారదర్శక ధర",
        monthly: "నెలవారీ",
        yearly: "వార్షిక",
        save: "ఉత్తమ విలువ",
      },
      benefits: [
        "1000+ AI టూల్స్ యాక్సెస్",
        "N8N వర్క్‌ఫ్లో ఆటోమేషన్",
        "AI ఏజెంట్ అభివృద్ధి",
        "టెక్స్ట్-టు-యాప్ జనరేషన్",
        "బ్యాకెండ్ + ఫ్రంటెండ్ + DB",
        "వన-క్లిక్ డిప్లాయ్‌మెంట్",
        "ఓపెన్ సోర్స్ కోడ్",
        "VPS డిప్లాయ్‌మెంట్ గైడ్",
      ],
    },
    hindi: {
      hero: {
        badge: "🚀 सीमित समय का ऑफर",
        title: "10 मिनट में $10,000 मूल्य के ऐप्स बनाएं",
        subtitle: "एक प्लेटफॉर्म। 1000+ AI टूल्स। असीमित संभावनाएं।",
        description: "कई AI सब्सक्रिप्शन के लिए भुगतान करना बंद करें। ChatGPT, Midjourney, Claude, Gemini और 1000+ टूल्स को एक सब्सक्रिप्शन से एक्सेस करें।",
        cta: "अपनी यात्रा शुरू करें - $5.99/माह",
        secondaryCta: "सभी टूल्स देखें",
      },
      features: {
        title: "AI-संचालित ऐप्स बनाने के लिए आपको चाहिए सब कुछ",
        subtitle: "विचार से तैनाती तक मिनटों में, महीनों में नहीं",
      },
      pricing: {
        title: "सरल, पारदर्शी मूल्य निर्धारण",
        monthly: "मासिक",
        yearly: "वार्षिक",
        save: "सर्वश्रेष्ठ मूल्य",
      },
      benefits: [
        "1000+ AI टूल्स एक्सेस",
        "N8N वर्कफ्लो ऑटोमेशन",
        "AI एजेंट विकास",
        "टेक्स्ट-टू-ऐप जनरेशन",
        "बैकेंड + फ्रंटएंड + DB",
        "वन-क्लिक डिप्लॉयमेंट",
        "ओपन सोर्स कोड",
        "VPS डिप्लॉयमेंट गाइड",
      ],
    },
  };

  const t = translations[language as keyof typeof translations];

  const features = [
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "N8N Workflow Automation",
      description: "Build complex automation workflows without coding",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Models Integration",
      description: "Access GPT-5, Gemini 2.5, Claude, Llama & more",
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Agent Development",
      description: "Create intelligent agents for any task",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Text to App Generation",
      description: "Describe your app, get production-ready code",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Full Stack in Minutes",
      description: "Backend, Frontend, Database - all automated",
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "One-Click Deployment",
      description: "Deploy to VPS or cloud with single click",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>

            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              {t.hero.subtitle}
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                <Zap className="mr-2 h-5 w-5" />
                {t.hero.cta}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-lg px-8 py-6"
                onClick={() => navigate("/tools")}
              >
                {t.hero.secondaryCta}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">AI Tools</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">10 min</div>
                <div className="text-sm text-muted-foreground">Build Time</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">$10K</div>
                <div className="text-sm text-muted-foreground">App Value</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1x</div>
                <div className="text-sm text-muted-foreground">Subscription</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t.features.title}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-gradient-card border-border hover:shadow-glow transition-all hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                What You Get
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t.pricing.title}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="p-8 bg-gradient-card border-2 border-border hover:border-primary transition-all hover:-translate-y-2 hover:shadow-glow">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">{t.pricing.monthly}</h3>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground line-through">$9.99</div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-primary">$5.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use code <strong className="text-primary">SAVE200</strong> at checkout
                </p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Yearly Plan */}
            <Card className="p-8 bg-gradient-card border-2 border-primary relative hover:-translate-y-2 hover:shadow-glow transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary px-4 py-1 rounded-full">
                <span className="text-sm font-bold text-primary-foreground">
                  {t.pricing.save}
                </span>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">{t.pricing.yearly}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-primary">$99.99</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-primary font-semibold">
                  Save $19.89 + Get Open Source Access
                </p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Stop Paying for Multiple Tools
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Get unlimited access to 1000+ AI tools, workflows, and open source code.
              Build enterprise-grade apps in minutes, not months.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Building Today - $5.99/mo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
