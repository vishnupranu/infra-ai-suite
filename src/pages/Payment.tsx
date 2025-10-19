import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Smartphone } from "lucide-react";
import { z } from "zod";

const paymentSchema = z.object({
  toolId: z.string().uuid("Invalid tool ID"),
  amount: z.number().positive("Amount must be positive"),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID").optional(),
});

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tool, setTool] = useState<any>(null);
  const [upiId, setUpiId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"gpay" | "phonepe" | "upi">("gpay");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalAmount, setFinalAmount] = useState(499); // Default to monthly price
  const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly");

  const toolId = searchParams.get("tool");
  const baseAmount = parseFloat(searchParams.get("amount") || "0");

  useEffect(() => {
    checkUser();
    if (toolId) loadTool();
  }, [toolId]);

  useEffect(() => {
    // Set initial amount based on plan type
    if (planType === "monthly") {
      setFinalAmount(discountApplied ? 299 : 499);
    } else {
      setFinalAmount(9999);
    }
  }, [planType, discountApplied]);

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

    // Validate inputs
    const validation = paymentSchema.safeParse({
      toolId,
      amount: finalAmount,
      upiId: selectedMethod === "upi" ? upiId : undefined,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({ title: "Validation Error", description: firstError.message, variant: "destructive" });
      return;
    }

    if (selectedMethod === "upi" && !upiId) {
      toast({ title: "Please enter UPI ID", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Verify tool exists and amount is valid
      const { data: toolData, error: toolError } = await supabase
        .from("ai_tools")
        .select("price_monthly, price_annual")
        .eq("id", toolId)
        .single();

      if (toolError || !toolData) {
        throw new Error("Invalid tool selected");
      }

      const validAmount = finalAmount === toolData.price_monthly || finalAmount === toolData.price_annual || finalAmount === 299 || finalAmount === 9999;
      if (!validAmount) {
        throw new Error("Invalid payment amount");
      }

      // Create payment record
      const { data: payment, error } = await supabase
        .from("payments")
        .insert([{
          user_id: user.id,
          tool_id: toolId,
          amount: finalAmount,
          payment_method: selectedMethod,
          upi_id: selectedMethod === "upi" ? upiId : null,
          status: "pending"
        }])
        .select()
        .single();

      if (error) {
        throw error;
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
    } catch (error: any) {
      toast({ 
        title: "Payment failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE200" && planType === "monthly") {
      setDiscountApplied(true);
      setFinalAmount(299);
      toast({ 
        title: "Promo code applied!", 
        description: "You saved ₹200! Final amount: ₹299" 
      });
    } else {
      toast({ 
        title: "Invalid promo code", 
        description: "Please check the code and try again", 
        variant: "destructive" 
      });
    }
  };

  const generateUpiUrl = (paymentId: string) => {
    const merchantUpi = "8884162999-4@ybl";
    const merchantName = "AItechuser";
    const transactionNote = `Payment to ${merchantName}`;
    
    // UPI deep link format
    return `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(transactionNote)}&cu=INR&am=${finalAmount}`;
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
      <Card className="bg-gradient-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">Complete Payment</CardTitle>
          <CardDescription>
            Subscribe to access 1000+ AI Tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPlanType("monthly")}
                className={`p-6 border-2 rounded-xl transition-all ${
                  planType === "monthly" 
                    ? "border-primary bg-primary/10 shadow-glow" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-xl mb-2">Monthly Plan</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    {!discountApplied && (
                      <span className="text-3xl font-bold text-primary">₹499</span>
                    )}
                    {discountApplied && (
                      <>
                        <span className="text-2xl text-muted-foreground line-through">₹499</span>
                        <span className="text-3xl font-bold text-primary">₹299</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Access to all AI tools</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setPlanType("yearly");
                  setDiscountApplied(false);
                }}
                className={`p-6 border-2 rounded-xl transition-all relative ${
                  planType === "yearly" 
                    ? "border-primary bg-primary/10 shadow-glow" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="absolute -top-3 -right-3 bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
                <div className="text-left">
                  <p className="font-bold text-xl mb-2">Yearly Plan</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">₹9,999</span>
                  </div>
                  <p className="text-sm text-muted-foreground">All tools + Open source access</p>
                  <p className="text-xs text-primary mt-1">Save ₹2,989 per year!</p>
                </div>
              </button>
            </div>
          </div>

          {/* Promo Code */}
          {planType === "monthly" && !discountApplied && (
            <div className="space-y-2 animate-fade-in">
              <h3 className="font-semibold">Have a promo code?</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code (e.g., SAVE200)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  onClick={applyPromoCode}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use code SAVE200 to get ₹200 off!</p>
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
            className="w-full bg-gradient-primary hover:shadow-glow transition-all"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${finalAmount}`
            )}
          </Button>

          {discountApplied && planType === "monthly" && (
            <div className="p-4 bg-primary/10 border border-primary rounded-lg animate-fade-in">
              <p className="text-sm text-center">
                🎉 You're saving ₹200 with promo code <strong>SAVE200</strong>
              </p>
            </div>
          )}

          {planType === "yearly" && (
            <div className="p-4 bg-primary/10 border border-primary rounded-lg">
              <p className="text-sm text-center font-semibold">
                ✨ Yearly plan includes VPS deployment access & open source code
              </p>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by UPI. Your payment information is encrypted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}