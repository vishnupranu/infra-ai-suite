import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, CreditCard, Download, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PaymentHistory() {
  const { language } = useAppStore();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPayments();
  }, [user]);

  const loadPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*, ai_tools(name)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    setPayments(data || []);
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    success: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Payment History" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Payment History</span>
          </h1>

          <Card className="bg-gradient-card border-border">
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payments yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.ai_tools?.name || "Subscription"}
                        </TableCell>
                        <TableCell className="font-bold">
                          ${Number(payment.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.payment_method || "UPI"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[payment.status] || statusColors.pending}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
