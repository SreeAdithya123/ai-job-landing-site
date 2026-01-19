-- Update the trigger function to create 'free' plan for new users instead of 'beginner'
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, credits_remaining, credits_per_month)
  VALUES (NEW.id, 'free', 0, 0);
  RETURN NEW;
END;
$function$;