-- Update the trigger function to give 1 credit for free plan users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, credits_remaining, credits_per_month)
  VALUES (NEW.id, 'free', 1, 1);
  RETURN NEW;
END;
$function$;

-- Update admin function to use correct credit values
CREATE OR REPLACE FUNCTION public.admin_update_subscription(p_target_user_id uuid, p_new_plan subscription_plan)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  new_credits integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  CASE p_new_plan
    WHEN 'free' THEN new_credits := 1;
    WHEN 'beginner' THEN new_credits := 3;
    WHEN 'plus' THEN new_credits := 5;
    WHEN 'pro' THEN new_credits := 10;
  END CASE;

  INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    credits_remaining,
    credits_per_month,
    billing_cycle_start
  ) VALUES (
    p_target_user_id,
    p_new_plan,
    new_credits,
    new_credits,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan = EXCLUDED.plan,
    credits_remaining = EXCLUDED.credits_remaining,
    credits_per_month = EXCLUDED.credits_per_month,
    billing_cycle_start = EXCLUDED.billing_cycle_start,
    updated_at = now();

  RETURN TRUE;
END;
$function$;