-- Add has_role function for secure role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add otp_codes table for mobile verification
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  user_id uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create chat_sessions table for AI assistant
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create announcements table for admin broadcasts
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create user_favorites for bookmarking tools
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id uuid REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Enable RLS on new tables
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- OTP codes policies
CREATE POLICY "Users can read their own OTP codes" ON public.otp_codes
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Chat sessions policies
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can manage messages in their sessions" ON public.chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = chat_messages.session_id 
      AND user_id = auth.uid()
    )
  );

-- Announcements policies (public read, admin write)
CREATE POLICY "Anyone can read active announcements" ON public.announcements
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User favorites policies
CREATE POLICY "Users can manage their favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Update profiles for subscription tracking
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_end timestamptz,
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Create trigger to auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_unique_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON public.profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_code();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON public.otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_referral ON public.profiles(referral_code);

-- Seed sample AI tools if table is empty
INSERT INTO public.ai_tools (name, description, category, affiliate_link, price_monthly, price_annual, rating, is_featured, features)
SELECT * FROM (VALUES
  ('ChatGPT Pro', 'Advanced AI assistant for conversations, coding, and analysis', 'AI Assistant', 'https://chat.openai.com', 9.99, 99.99, 4.9, true, ARRAY['Unlimited messages', 'Code generation', 'Image analysis']),
  ('Midjourney', 'AI-powered image generation with stunning quality', 'Image Generation', 'https://midjourney.com', 9.99, 99.99, 4.8, true, ARRAY['HD images', 'Style variations', 'Fast generation']),
  ('Claude 3', 'Anthropic powerful AI for complex reasoning', 'AI Assistant', 'https://claude.ai', 9.99, 99.99, 4.7, true, ARRAY['Long context', 'Document analysis', 'Safe responses']),
  ('Gemini Pro', 'Google multimodal AI for text and images', 'AI Assistant', 'https://gemini.google.com', 9.99, 99.99, 4.6, false, ARRAY['Multimodal', 'Real-time info', 'Integration']),
  ('DALL-E 3', 'OpenAI latest image generation model', 'Image Generation', 'https://openai.com/dall-e-3', 9.99, 99.99, 4.7, false, ARRAY['Photorealistic', 'Text in images', 'Style control']),
  ('Stable Diffusion', 'Open source image generation powerhouse', 'Image Generation', 'https://stability.ai', 9.99, 99.99, 4.5, false, ARRAY['Open source', 'Customizable', 'Local deployment']),
  ('N8N Workflows', 'Automate complex workflows without coding', 'Automation', 'https://n8n.io', 9.99, 99.99, 4.6, true, ARRAY['Visual builder', '500+ integrations', 'Self-host option']),
  ('LangChain', 'Build AI agents and complex AI applications', 'Development', 'https://langchain.com', 9.99, 99.99, 4.4, false, ARRAY['Agent framework', 'Memory systems', 'Tool integration']),
  ('Cursor AI', 'AI-powered code editor for developers', 'Development', 'https://cursor.sh', 9.99, 99.99, 4.8, true, ARRAY['Code completion', 'Bug fixing', 'Refactoring']),
  ('Lovable', 'Build full-stack apps with AI in minutes', 'Development', 'https://lovable.dev', 9.99, 99.99, 4.9, true, ARRAY['Full-stack', 'One-click deploy', 'Supabase built-in']),
  ('Runway ML', 'AI video generation and editing', 'Video', 'https://runway.ml', 9.99, 99.99, 4.5, false, ARRAY['Video generation', 'Motion tracking', 'Green screen']),
  ('ElevenLabs', 'AI voice synthesis and cloning', 'Audio', 'https://elevenlabs.io', 9.99, 99.99, 4.7, false, ARRAY['Voice cloning', 'Multi-language', 'API access']),
  ('Jasper AI', 'AI content generation for marketing', 'Writing', 'https://jasper.ai', 9.99, 99.99, 4.4, false, ARRAY['Blog posts', 'Ad copy', 'SEO optimization']),
  ('Copy.ai', 'AI copywriting for businesses', 'Writing', 'https://copy.ai', 9.99, 99.99, 4.3, false, ARRAY['Templates', 'Multiple languages', 'Brand voice']),
  ('Notion AI', 'AI-enhanced productivity workspace', 'Productivity', 'https://notion.so', 9.99, 99.99, 4.6, false, ARRAY['Document AI', 'Summarization', 'Writing assist'])
) AS t(name, description, category, affiliate_link, price_monthly, price_annual, rating, is_featured, features)
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools LIMIT 1);