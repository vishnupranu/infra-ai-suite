-- Add phone and payment verification to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id);

-- Update payments table default currency to USD
ALTER TABLE public.payments 
ALTER COLUMN currency SET DEFAULT 'USD';

-- Create index for faster payment verification lookups
CREATE INDEX IF NOT EXISTS idx_profiles_payment_verified ON public.profiles(payment_verified);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id, status);

-- Update existing payments to USD (for demo purposes, keeping the numeric values)
UPDATE public.payments SET currency = 'USD' WHERE currency = 'INR';