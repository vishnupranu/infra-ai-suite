CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins can read analytics" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert analytics" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.industry_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.industry_solutions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read industry solutions" ON public.industry_solutions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'developer';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO public.industry_solutions (name, slug, description, icon_name, features) VALUES
  ('E-Commerce', 'e-commerce', 'AI-powered e-commerce solutions for product recommendations and customer service.', 'ShoppingCart', '["Product Recommendations", "Dynamic Pricing", "Inventory Forecasting", "Chatbot Support"]'),
  ('Healthcare', 'healthcare', 'HIPAA-compliant AI tools for diagnostics and patient management.', 'Heart', '["Medical Imaging AI", "Patient Triage", "Drug Discovery", "EHR Analysis"]'),
  ('Finance', 'finance', 'AI solutions for fraud detection, algorithmic trading, and risk assessment.', 'DollarSign', '["Fraud Detection", "Algorithmic Trading", "Risk Assessment", "Credit Scoring"]'),
  ('Education', 'education', 'Personalized learning platforms and intelligent tutoring systems.', 'GraduationCap', '["Adaptive Learning", "Auto Grading", "Content Generation", "Student Analytics"]'),
  ('Manufacturing', 'manufacturing', 'Predictive maintenance and supply chain optimization powered by AI.', 'Factory', '["Predictive Maintenance", "Quality Inspection", "Supply Chain AI", "Digital Twin"]'),
  ('Real Estate', 'real-estate', 'Property valuation and virtual staging powered by AI.', 'Building', '["Property Valuation", "Virtual Staging", "Market Prediction", "Lead Scoring"]')
ON CONFLICT (slug) DO NOTHING