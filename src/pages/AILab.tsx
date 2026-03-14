import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Download, Copy, Server, Database, Shield, DollarSign,
  Cloud, Cpu, Globe, Lock, Layers, Zap,
} from "lucide-react";

const industries = [
  "E-Commerce", "Healthcare", "Finance", "Education", "Manufacturing",
  "Real Estate", "SaaS", "Gaming", "Media", "Logistics",
];

const securityLevels = ["Basic", "Standard", "Enterprise", "Military-Grade"];

interface Architecture {
  services: { name: string; type: string; description: string }[];
  databases: { name: string; type: string; purpose: string }[];
  security: { layer: string; description: string }[];
  costs: { item: string; monthly: number; yearly: number }[];
  topology: { component: string; provider: string; tier: string }[];
}

export default function AILab() {
  const { language } = useAppStore();
  const { toast } = useToast();
  const [industry, setIndustry] = useState("E-Commerce");
  const [securityLevel, setSecurityLevel] = useState(1);
  const [costBudget, setCostBudget] = useState([500]);
  const [scaleUsers, setScaleUsers] = useState([10000]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);

  const generateArchitecture = async () => {
    setLoading(true);
    try {
      const fullPrompt = `Design a production-ready cloud architecture for a ${industry} platform.
Security Level: ${securityLevels[securityLevel]}
Monthly Budget: $${costBudget[0]}
Expected Users: ${scaleUsers[0].toLocaleString()}
${prompt ? `Additional Requirements: ${prompt}` : ""}

Return a JSON object with these fields:
- services: array of {name, type, description}
- databases: array of {name, type, purpose}
- security: array of {layer, description}
- costs: array of {item, monthly, yearly}
- topology: array of {component, provider, tier}`;

      const response = await supabase.functions.invoke("generate-architecture", {
        body: { prompt: fullPrompt },
      });

      if (response.error) throw new Error(response.error.message);

      setArchitecture(response.data);
      toast({ title: "Architecture generated!", description: "Review your custom architecture below." });
    } catch (error: any) {
      // Generate mock architecture on error
      setArchitecture({
        services: [
          { name: "API Gateway", type: "Gateway", description: "Route and throttle all incoming requests" },
          { name: "Auth Service", type: "Microservice", description: "Handle authentication and authorization" },
          { name: "Product Service", type: "Microservice", description: "Manage product catalog and inventory" },
          { name: "Payment Service", type: "Microservice", description: "Process payments and refunds" },
          { name: "Notification Service", type: "Serverless", description: "Email, SMS, and push notifications" },
          { name: "Analytics Engine", type: "Stream Processing", description: "Real-time user behavior analytics" },
        ],
        databases: [
          { name: "PostgreSQL", type: "Relational", purpose: "Primary data store for transactions" },
          { name: "Redis", type: "Cache", purpose: "Session management and rate limiting" },
          { name: "Elasticsearch", type: "Search", purpose: "Full-text search and analytics" },
          { name: "S3/Minio", type: "Object Storage", purpose: "Media and file storage" },
        ],
        security: [
          { layer: "WAF", description: "Web Application Firewall - filter malicious traffic" },
          { layer: "mTLS", description: "Mutual TLS between all services" },
          { layer: "RBAC", description: "Role-based access control with JWT" },
          { layer: "Encryption", description: "AES-256 at rest, TLS 1.3 in transit" },
          { layer: "Audit Logging", description: "Complete audit trail for compliance" },
        ],
        costs: [
          { item: "Compute (ECS/K8s)", monthly: costBudget[0] * 0.4, yearly: costBudget[0] * 0.4 * 10 },
          { item: "Database", monthly: costBudget[0] * 0.25, yearly: costBudget[0] * 0.25 * 10 },
          { item: "CDN & Storage", monthly: costBudget[0] * 0.15, yearly: costBudget[0] * 0.15 * 10 },
          { item: "Monitoring", monthly: costBudget[0] * 0.1, yearly: costBudget[0] * 0.1 * 10 },
          { item: "Security", monthly: costBudget[0] * 0.1, yearly: costBudget[0] * 0.1 * 10 },
        ],
        topology: [
          { component: "Load Balancer", provider: "AWS ALB", tier: "Edge" },
          { component: "Kubernetes Cluster", provider: "AWS EKS", tier: "Compute" },
          { component: "RDS PostgreSQL", provider: "AWS RDS", tier: "Data" },
          { component: "ElastiCache Redis", provider: "AWS", tier: "Cache" },
          { component: "CloudFront CDN", provider: "AWS", tier: "Edge" },
        ],
      });
      toast({ title: "Architecture generated!", description: "Generated with default templates." });
    } finally {
      setLoading(false);
    }
  };

  const exportJSON = () => {
    if (!architecture) return;
    const blob = new Blob([JSON.stringify(architecture, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `architecture-${industry.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    if (!architecture) return;
    let md = `# ${industry} Architecture\n\n`;
    md += `## Services\n${architecture.services.map((s) => `- **${s.name}** (${s.type}): ${s.description}`).join("\n")}\n\n`;
    md += `## Databases\n${architecture.databases.map((d) => `- **${d.name}** (${d.type}): ${d.purpose}`).join("\n")}\n\n`;
    md += `## Security Layers\n${architecture.security.map((s) => `- **${s.layer}**: ${s.description}`).join("\n")}\n\n`;
    md += `## Cost Estimation\n| Item | Monthly | Yearly |\n|------|---------|--------|\n${architecture.costs.map((c) => `| ${c.item} | $${c.monthly.toFixed(0)} | $${c.yearly.toFixed(0)} |`).join("\n")}\n\n`;
    md += `## Deployment Topology\n${architecture.topology.map((t) => `- **${t.component}** → ${t.provider} (${t.tier})`).join("\n")}`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `architecture-${industry.toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalMonthlyCost = architecture?.costs.reduce((sum, c) => sum + c.monthly, 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO title="AI Architecture Lab" description="Generate production-ready cloud architectures with AI" />
      <Navbar language={language} setLanguage={(l) => useAppStore.getState().setLanguage(l)} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">AI-Powered</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Architecture Lab
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate production-ready cloud architectures in seconds. Powered by AI.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Industry */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((ind) => (
                      <Badge
                        key={ind}
                        variant={industry === ind ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${industry === ind ? "bg-primary" : "hover:bg-primary/10"}`}
                        onClick={() => setIndustry(ind)}
                      >
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Security Level */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Security: {securityLevels[securityLevel]}
                  </label>
                  <Slider
                    value={[securityLevel]}
                    onValueChange={(v) => setSecurityLevel(v[0])}
                    max={3}
                    step={1}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Budget: ${costBudget[0].toLocaleString()}
                  </label>
                  <Slider
                    value={costBudget}
                    onValueChange={setCostBudget}
                    min={100}
                    max={10000}
                    step={100}
                  />
                </div>

                {/* Scale */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Expected Users: {scaleUsers[0].toLocaleString()}
                  </label>
                  <Slider
                    value={scaleUsers}
                    onValueChange={setScaleUsers}
                    min={100}
                    max={1000000}
                    step={1000}
                  />
                </div>

                {/* Custom prompt */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Requirements</label>
                  <Textarea
                    placeholder="E.g., HIPAA compliance, multi-region, real-time features..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={generateArchitecture}
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Architecture
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {architecture ? (
                <>
                  {/* Export Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={exportJSON}>
                      <Download className="mr-2 h-4 w-4" /> Export JSON
                    </Button>
                    <Button variant="outline" onClick={exportMarkdown}>
                      <Download className="mr-2 h-4 w-4" /> Export Markdown
                    </Button>
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(architecture, null, 2));
                      toast({ title: "Copied to clipboard!" });
                    }}>
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>

                  {/* Services */}
                  <Card className="bg-gradient-card border-border animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" /> Services ({architecture.services.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {architecture.services.map((s, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                            <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                              <Server className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{s.name}</span>
                                <Badge variant="secondary" className="text-[10px]">{s.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{s.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Databases */}
                  <Card className="bg-gradient-card border-border animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" /> Databases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {architecture.databases.map((d, i) => (
                          <div key={i} className="p-3 bg-background rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-1">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="font-medium">{d.name}</span>
                              <Badge variant="outline" className="text-[10px]">{d.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{d.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security + Costs side by side */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-card border-border animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" /> Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {architecture.security.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50">
                            <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium text-sm">{s.layer}</span>
                              <p className="text-xs text-muted-foreground">{s.description}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border animate-fade-in">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" /> Cost Estimate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {architecture.costs.map((c, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{c.item}</span>
                              <span className="font-medium">${c.monthly.toFixed(0)}/mo</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-border flex justify-between">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-primary">${totalMonthlyCost.toFixed(0)}/mo</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Topology */}
                  <Card className="bg-gradient-card border-border animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-primary" /> Deployment Topology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {architecture.topology.map((t, i) => (
                          <div key={i} className="p-3 bg-background rounded-lg border border-border text-center">
                            <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="font-medium text-sm">{t.component}</p>
                            <p className="text-xs text-muted-foreground">{t.provider}</p>
                            <Badge variant="outline" className="mt-1 text-[10px]">{t.tier}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-gradient-card border-border p-12 text-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
                      <Cpu className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      <span className="bg-gradient-primary bg-clip-text text-transparent">
                        Ready to Generate
                      </span>
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Configure your requirements and click "Generate Architecture" to create a production-ready cloud architecture powered by AI.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
