/*
  # Create Initial Admin User

  1. Changes
    - Insert initial admin user into profiles table
    - Set role as 'admin' for this user

  2. Security
    - Uses existing RLS policies
    - Admin credentials should be changed after first login
*/

DO $$
BEGIN
  -- Insert admin user if not exists
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
  VALUES (
    gen_random_uuid(),
    'admin@catoiadocorte.com',
    crypt('admin123', gen_salt('bf')),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  -- Set admin role
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'admin@catoiadocorte.com';
END $$;