-- Make user 607249a2-92c7-4713-a399-fb00833fedc8 an admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('607249a2-92c7-4713-a399-fb00833fedc8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;