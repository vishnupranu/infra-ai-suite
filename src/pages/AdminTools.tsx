import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  affiliate_link: string;
  price_monthly: number | null;
  price_annual: number | null;
  rating: number | null;
  is_featured: boolean;
  icon_url: string | null;
  features: string[] | null;
}

export default function AdminTools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    affiliate_link: "",
    price_monthly: "",
    price_annual: "",
    rating: "5",
    is_featured: false,
    icon_url: "",
    features: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    const { data, error } = await supabase
      .from("ai_tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading tools", variant: "destructive" });
    } else {
      setTools(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      affiliate_link: formData.affiliate_link,
      price_monthly: formData.price_monthly ? parseFloat(formData.price_monthly) : null,
      price_annual: formData.price_annual ? parseFloat(formData.price_annual) : null,
      rating: parseFloat(formData.rating),
      is_featured: formData.is_featured,
      icon_url: formData.icon_url || null,
      features: formData.features ? formData.features.split(",").map(f => f.trim()) : null
    };

    if (editingTool) {
      const { error } = await supabase
        .from("ai_tools")
        .update(toolData)
        .eq("id", editingTool.id);

      if (error) {
        toast({ title: "Error updating tool", variant: "destructive" });
      } else {
        toast({ title: "Tool updated successfully!" });
        resetForm();
        loadTools();
      }
    } else {
      const { error } = await supabase
        .from("ai_tools")
        .insert([toolData]);

      if (error) {
        toast({ title: "Error adding tool", variant: "destructive" });
      } else {
        toast({ title: "Tool added successfully!" });
        resetForm();
        loadTools();
      }
    }
  };

  const handleEdit = (tool: AITool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      affiliate_link: tool.affiliate_link,
      price_monthly: tool.price_monthly?.toString() || "",
      price_annual: tool.price_annual?.toString() || "",
      rating: tool.rating?.toString() || "5",
      is_featured: tool.is_featured || false,
      icon_url: tool.icon_url || "",
      features: tool.features?.join(", ") || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    const { error } = await supabase
      .from("ai_tools")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting tool", variant: "destructive" });
    } else {
      toast({ title: "Tool deleted successfully!" });
      loadTools();
    }
  };

  const resetForm = () => {
    setEditingTool(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      affiliate_link: "",
      price_monthly: "",
      price_annual: "",
      rating: "5",
      is_featured: false,
      icon_url: "",
      features: ""
    });
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
      <h1 className="text-3xl font-bold mb-8">Manage AI Tools</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>{editingTool ? "Edit Tool" : "Add New Tool"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Tool Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <Input
                placeholder="Affiliate Link"
                value={formData.affiliate_link}
                onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                required
              />
              <Input
                placeholder="Icon URL"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Monthly Price"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Annual Price"
                  value={formData.price_annual}
                  onChange={(e) => setFormData({ ...formData, price_annual: e.target.value })}
                />
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Rating (0-5)"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
              <Input
                placeholder="Features (comma separated)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span>Featured Tool</span>
              </label>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingTool ? "Update Tool" : "Add Tool"}
                </Button>
                {editingTool && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Existing Tools ({tools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {tools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(tool)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(tool.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}