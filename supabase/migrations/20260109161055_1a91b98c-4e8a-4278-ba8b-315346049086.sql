-- Update the default subscription to beginner for new users
ALTER TABLE public.user_subscriptions 
ALTER COLUMN plan SET DEFAULT 'beginner'::subscription_plan,
ALTER COLUMN credits_remaining SET DEFAULT 0,
ALTER COLUMN credits_per_month SET DEFAULT 0;

-- Update handle_new_user_subscription to use beginner plan
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, credits_remaining, credits_per_month)
  VALUES (NEW.id, 'beginner', 0, 0);
  RETURN NEW;
END;
$$;

-- Update admin_update_subscription to handle beginner plan
CREATE OR REPLACE FUNCTION public.admin_update_subscription(p_target_user_id uuid, p_new_plan subscription_plan)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Determine credits based on plan
  CASE p_new_plan
    WHEN 'beginner' THEN new_credits := 0;
    WHEN 'free' THEN new_credits := 2;
    WHEN 'plus' THEN new_credits := 5;
    WHEN 'pro' THEN new_credits := 10;
  END CASE;
  
  -- Update subscription
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