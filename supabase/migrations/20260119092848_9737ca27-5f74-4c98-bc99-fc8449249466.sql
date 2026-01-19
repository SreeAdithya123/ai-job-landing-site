-- Drop the existing function first
DROP FUNCTION IF EXISTS public.admin_get_all_users();

-- Recreate with correct return types (numeric instead of integer)
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
 RETURNS TABLE(user_id uuid, email text, full_name text, plan text, credits_remaining numeric, credits_per_month numeric, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    COALESCE(us.plan::TEXT, 'beginner') as plan,
    COALESCE(us.credits_remaining, 0) as credits_remaining,
    COALESCE(us.credits_per_month, 0) as credits_per_month,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_subscriptions us ON p.id = us.user_id
  ORDER BY p.created_at DESC;
END;
$function$;