import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Smartphone } from "lucide-react";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tool, setTool] = useState<any>(null);
  const [upiId, setUpiId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"gpay" | "phonepe" | "upi">("gpay");

  const toolId = searchParams.get("tool");
  const amount = parseFloat(searchParams.get("amount") || "0");

  useEffect(() => {
    checkUser();
    if (toolId) loadTool();
  }, [toolId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const loadTool = async () => {
    const { data } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("id", toolId)
      .single();
    
    if (data) setTool(data);
  };

  const handlePayment = async () => {
    if (!user || !toolId) return;

    if (selectedMethod === "upi" && !upiId) {
      toast({ title: "Please enter UPI ID", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Create payment record
    const { data: payment, error } = await supabase
      .from("payments")
      .insert([{
        user_id: user.id,
        tool_id: toolId,
        amount: amount,
        payment_method: selectedMethod,
        upi_id: selectedMethod === "upi" ? upiId : null,
        status: "pending"
      }])
      .select()
      .single();

    if (error) {
      toast({ title: "Payment failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Generate UPI payment link
    const upiUrl = generateUpiUrl(payment.id);
    
    // Open UPI app
    window.location.href = upiUrl;

    // Show success message
    toast({ 
      title: "Payment initiated", 
      description: "Please complete payment in your UPI app" 
    });

    // Wait for payment confirmation (in real app, use webhooks)
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  const generateUpiUrl = (paymentId: string) => {
    const merchantUpi = "merchant@upi"; // Replace with actual merchant UPI
    const merchantName = "APPAIETECH";
    const transactionNote = `Payment for ${tool?.name || "AI Tool"}`;
    
    // UPI deep link format
    return `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${paymentId}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="bg-gradient-to-br from-background to-card border-border">
        <CardHeader>
          <CardTitle className="text-3xl">Complete Payment</CardTitle>
          <CardDescription>
            {tool ? `Subscribe to ${tool.name}` : "Process your payment securely"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tool && (
            <div className="p-4 bg-background/50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">₹{amount}</span>
                <span className="text-sm text-muted-foreground">per month</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Select Payment Method</h3>
            
            <div className="grid gap-4">
              <button
                onClick={() => setSelectedMethod("gpay")}
                className={`p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                  selectedMethod === "gpay" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Smartphone className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Google Pay</p>
                  <p className="text-sm text-muted-foreground">Pay using GPay</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("phonepe")}
                className={`p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                  selectedMethod === "phonepe" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Smartphone className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">PhonePe</p>
                  <p className="text-sm text-muted-foreground">Pay using PhonePe</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("upi")}
                className={`p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                  selectedMethod === "upi" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <CreditCard className="w-8 h-8 text-primary" />
                <div className="text-left flex-1">
                  <p className="font-semibold">Other UPI</p>
                  <p className="text-sm text-muted-foreground">Enter your UPI ID</p>
                </div>
              </button>
            </div>

            {selectedMethod === "upi" && (
              <Input
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by UPI. Your payment information is encrypted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}