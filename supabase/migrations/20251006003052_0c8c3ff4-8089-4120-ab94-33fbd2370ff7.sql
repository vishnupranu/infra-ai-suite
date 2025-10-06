-- Phase 1: Critical Database Security Fixes

-- 1. Fix profiles table - restrict email visibility to own profile only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Secure earnings table - remove public INSERT policy
DROP POLICY IF EXISTS "System can create earnings" ON public.earnings;

CREATE POLICY "Only backend can create earnings"
ON public.earnings
FOR INSERT
WITH CHECK (false); -- Only service_role (backend) can insert

-- 3. Fix referrals table - require authentication
DROP POLICY IF EXISTS "Anyone can create referrals" ON public.referrals;

CREATE POLICY "Authenticated users can create referrals"
ON public.referrals
FOR INSERT
WITH CHECK (
  auth.uid() = referrer_id 
  AND auth.uid() != referred_user_id -- Prevent self-referrals
);

-- 4. Add missing user_roles policies for admin management
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Create secure function to check if payment amount matches tool price
CREATE OR REPLACE FUNCTION public.validate_payment_amount(
  p_tool_id uuid,
  p_amount numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tool_monthly numeric;
  tool_annual numeric;
BEGIN
  SELECT price_monthly, price_annual
  INTO tool_monthly, tool_annual
  FROM ai_tools
  WHERE id = p_tool_id;
  
  RETURN (p_amount = tool_monthly OR p_amount = tool_annual);
END;
$$;

-- 6. Add payment validation policy
CREATE POLICY "Users can only create valid payments"
ON public.payments
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND public.validate_payment_amount(tool_id, amount)
);