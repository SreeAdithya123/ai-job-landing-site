-- Drop and recreate the admin_update_subscription function with proper SECURITY DEFINER setup
CREATE OR REPLACE FUNCTION public.admin_update_subscription(p_target_user_id uuid, p_new_plan subscription_plan)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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
  
  -- Update subscription (using fully qualified table name)
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

-- Add RLS policy allowing admins to update any user's subscription
CREATE POLICY "Admins can update any subscription"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy allowing admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));