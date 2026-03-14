import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO title="Payment Successful" />
      <Card className="max-w-md w-full p-8 bg-gradient-card border-border text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Payment Successful!
          </span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Your subscription is now active. You have full access to 1000+ AI tools.
        </p>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Welcome to APPAIETECH Premium!</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-primary hover:shadow-glow"
            size="lg"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={() => navigate("/tools")}
            variant="outline"
            className="w-full"
          >
            Explore AI Tools
          </Button>
        </div>
      </Card>
    </div>
  );
}
