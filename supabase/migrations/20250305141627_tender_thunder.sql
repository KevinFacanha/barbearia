/*
  # Create Admin Profile

  1. Changes
    - Create admin profile with required fields
    - Set admin role and email for the profile
*/

-- Create admin profile if it doesn't exist
INSERT INTO public.profiles (id, email, role)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@catoiadocorte.com',
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE role = 'admin'
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  email = 'admin@catoiadocorte.com'
WHERE profiles.role != 'admin';