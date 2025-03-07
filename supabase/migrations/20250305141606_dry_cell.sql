/*
  # Create Admin User

  1. Changes
    - Create admin user in profiles table
    - Set admin role for the user

  Note: The actual user creation in auth.users should be done through the Supabase Auth API,
  not directly in the database.
*/

-- Create admin profile if it doesn't exist
INSERT INTO public.profiles (id, role)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE role = 'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin'
WHERE profiles.role != 'admin';