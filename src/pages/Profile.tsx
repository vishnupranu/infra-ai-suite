import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Loader2,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Save,
  Shield,
  Gift,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
      });
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({ title: "Profile updated successfully" });
      loadProfile();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar language="english" setLanguage={() => {}} />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Your Profile
              </span>
            </h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <div className="space-y-6">
            {/* Profile Info Card */}
            <Card className="bg-gradient-card border-border animate-fade-in">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="bg-gradient-card border-border animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">
                        {profile?.subscription_plan === "yearly" ? "Yearly Plan" : profile?.payment_verified ? "Monthly Plan" : "Free Plan"}
                      </h3>
                      <Badge variant={profile?.payment_verified ? "default" : "secondary"}>
                        {profile?.payment_verified ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {profile?.subscription_end && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Renews on {new Date(profile.subscription_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {!profile?.payment_verified && (
                    <Button
                      onClick={() => navigate("/payment")}
                      className="bg-gradient-primary hover:shadow-glow"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card className="bg-gradient-card border-border animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your unique referral code</p>
                    <p className="text-2xl font-bold text-primary">{profile?.referral_code || "N/A"}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/referrals")}>
                    View Referrals
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="bg-gradient-card border-border animate-fade-in" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Last changed: Never</p>
                    </div>
                    <Button variant="outline" disabled>
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div>
                      <h3 className="font-medium">Account Created</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
