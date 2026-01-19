-- Change default subscription plan from 'beginner' to 'free' for new users
ALTER TABLE public.user_subscriptions 
ALTER COLUMN plan SET DEFAULT 'free'::subscription_plan;