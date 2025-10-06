import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Users, DollarSign, TrendingUp, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Referrals() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });
  const [earnings, setEarnings] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadReferralData(user.id);
  };

  const loadReferralData = async (userId: string) => {
    // Load referral code
    const { data: codeData } = await supabase
      .from("referral_codes")
      .select("code")
      .eq("user_id", userId)
      .single();

    if (codeData) {
      setReferralCode(codeData.code);
    }

    // Load referrals
    const { data: referralsData } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (referralsData) {
      setReferrals(referralsData);
      setStats(prev => ({
        ...prev,
        totalReferrals: referralsData.length,
        activeReferrals: referralsData.filter(r => r.status === "active").length
      }));
    }

    // Load earnings
    const { data: earningsData } = await supabase
      .from("earnings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (earningsData) {
      setEarnings(earningsData);
      const total = earningsData.reduce((sum, e) => sum + Number(e.amount), 0);
      setStats(prev => ({
        ...prev,
        totalEarnings: total,
        pendingEarnings: total * 0.1 // Example: 10% pending
      }));
    }

    setLoading(false);
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Referral link copied!", description: "Share it with your friends" });
  };

  const shareReferral = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    const text = `Join APPAIETECH - Access 1000+ AI tools in one place! Use my referral code: ${referralCode}`;
    
    if (navigator.share) {
      navigator.share({ title: "APPAIETECH", text, url: link });
    } else {
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
        <p className="text-muted-foreground">Earn credits by inviting friends to APPAIETECH</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Active Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeReferrals}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.pendingEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code to earn credits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-background rounded-lg border border-border">
              <code className="text-2xl font-bold text-primary">{referralCode}</code>
            </div>
            <Button onClick={copyReferralLink} variant="outline" size="lg">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={shareReferral} size="lg">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Earn ₹100 credits for each friend who signs up and makes their first purchase
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No referrals yet</p>
            ) : (
              <div className="space-y-3">
                {referrals.slice(0, 5).map((referral) => (
                  <div key={referral.id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium">User #{String(referral.referred_user_id).slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      referral.status === "active" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {referral.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No earnings yet</p>
            ) : (
              <div className="space-y-3">
                {earnings.slice(0, 5).map((earning) => (
                  <div key={earning.id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <div>
                      <p className="font-medium">{earning.source}</p>
                      <p className="text-sm text-muted-foreground">{earning.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(earning.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-green-500">
                      +₹{parseFloat(earning.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}