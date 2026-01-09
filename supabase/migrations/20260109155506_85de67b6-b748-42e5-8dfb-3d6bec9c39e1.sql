-- First create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create subscription plan enum
CREATE TYPE public.subscription_plan AS ENUM ('free', 'plus', 'pro');

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  credits_remaining INTEGER NOT NULL DEFAULT 2,
  credits_per_month INTEGER NOT NULL DEFAULT 2,
  billing_cycle_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create credit usage history table
CREATE TABLE public.credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_used INTEGER NOT NULL DEFAULT 1,
  interview_type TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.user_subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create subscriptions"
ON public.user_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for credit_usage
CREATE POLICY "Users can view their own credit usage"
ON public.credit_usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit usage"
ON public.credit_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update timestamp trigger for subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, credits_remaining, credits_per_month)
  VALUES (NEW.id, 'free', 2, 2);
  RETURN NEW;
END;
$$;

-- Trigger to create subscription on user signup
CREATE TRIGGER on_auth_user_created_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_subscription();

-- Function to deduct credits (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID, p_interview_type TEXT DEFAULT NULL, p_duration_minutes INTEGER DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits_remaining INTO current_credits
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;
  
  IF current_credits IS NULL OR current_credits <= 0 THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.user_subscriptions
  SET credits_remaining = credits_remaining - 1
  WHERE user_id = p_user_id;
  
  INSERT INTO public.credit_usage (user_id, credits_used, interview_type, duration_minutes)
  VALUES (p_user_id, 1, p_interview_type, p_duration_minutes);
  
  RETURN TRUE;
END;
$$;

-- Function to check if user has credits
CREATE OR REPLACE FUNCTION public.has_credits(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = p_user_id AND credits_remaining > 0
  )
$$;

-- Function to get subscription details
CREATE OR REPLACE FUNCTION public.get_subscription(p_user_id UUID)
RETURNS TABLE(plan subscription_plan, credits_remaining INTEGER, credits_per_month INTEGER, billing_cycle_start TIMESTAMP WITH TIME ZONE)
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT plan, credits_remaining, credits_per_month, billing_cycle_start
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
$$;

-- Admin function to update user subscription
CREATE OR REPLACE FUNCTION public.admin_update_subscription(
  p_target_user_id UUID,
  p_new_plan subscription_plan
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  CASE p_new_plan
    WHEN 'free' THEN new_credits := 2;
    WHEN 'plus' THEN new_credits := 5;
    WHEN 'pro' THEN new_credits := 10;
  END CASE;
  
  UPDATE public.user_subscriptions
  SET 
    plan = p_new_plan,
    credits_remaining = new_credits,
    credits_per_month = new_credits,
    billing_cycle_start = now()
  WHERE user_id = p_target_user_id;
  
  RETURN FOUND;
END;
$$;