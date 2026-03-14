import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { Loader2, Search, Shield, Trash2, UserCog, Users, Mail } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  payment_verified: boolean;
  subscription_plan: string;
  created_at: string;
  role?: string;
}

export default function AdminUsers() {
  const { language } = useAppStore();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles) {
      // Load roles
      const userIds = profiles.map((p) => p.id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      const usersWithRoles = profiles.map((p) => ({
        ...p,
        role: roles?.find((r) => r.user_id === p.id)?.role || "user",
      }));

      setUsers(usersWithRoles);
    }
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    // Upsert role
    // Delete existing roles first, then insert new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: newRole as any });

    if (error) {
      toast({ title: "Error updating role", variant: "destructive" });
    } else {
      toast({ title: "Role updated successfully" });
      loadUsers();
    }
  };

  const togglePaymentVerified = async (userId: string, current: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ payment_verified: !current })
      .eq("id", userId);

    if (error) {
      toast({ title: "Error updating payment status", variant: "destructive" });
    } else {
      toast({ title: `Payment ${!current ? "verified" : "unverified"} successfully` });
      loadUsers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="User Management" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <UserCog className="h-8 w-8 text-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  User Management
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">{users.length} total users</p>
            </div>
          </div>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.full_name || "No name"}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role || "user"}
                              onValueChange={(v) => updateRole(user.id, v)}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.subscription_plan === "free" ? "secondary" : "default"}>
                              {user.subscription_plan || "free"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={user.payment_verified ? "default" : "outline"}
                              size="sm"
                              className={user.payment_verified ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => togglePaymentVerified(user.id, user.payment_verified)}
                            >
                              {user.payment_verified ? "Verified" : "Pending"}
                            </Button>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Shield className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
