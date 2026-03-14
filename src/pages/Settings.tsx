import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import {
  User, Shield, CreditCard, Bell, Save, Loader2, Lock, Smartphone, Globe,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useAppStore();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast({ title: "Settings saved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="Settings" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Settings</span>
          </h1>

          <Tabs defaultValue="profile">
            <TabsList className="bg-secondary mb-6">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
              <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" /> Security</TabsTrigger>
              <TabsTrigger value="billing"><CreditCard className="h-4 w-4 mr-2" /> Billing</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" /> Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-gradient-card border-border">
                <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select
                      value={language}
                      onChange={(e) => useAppStore.getState().setLanguage(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="english">English</option>
                      <option value="telugu">తెలుగు</option>
                      <option value="hindi">हिन्दी</option>
                    </select>
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-primary">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gradient-card border-border">
                <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Change your password</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => toast({ title: "Password reset email sent!" })}>
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">{twoFAEnabled ? "Enabled" : "Disabled"}</p>
                      </div>
                    </div>
                    <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">1 active session</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="bg-gradient-card border-border">
                <CardHeader><CardTitle>Billing History</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No billing history yet</p>
                    <Button
                      className="mt-4 bg-gradient-primary"
                      onClick={() => navigate("/payment")}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gradient-card border-border">
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
