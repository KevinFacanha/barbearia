/*
  # Initial Schema Setup for Barbershop System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `role` (text, either 'client' or 'admin')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `appointment_date` (timestamptz)
      - `status` (text: 'scheduled', 'completed', 'cancelled')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for profiles and appointments
*/

-- Drop existing objects if they exist
DO $$ BEGIN
  -- Drop triggers first
  DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  
  -- Drop function
  DROP FUNCTION IF EXISTS update_updated_at_column();
  
  -- Drop policies
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
  DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
  DROP POLICY IF EXISTS "Users can cancel own appointments" ON appointments;
  DROP POLICY IF EXISTS "Admins can update any appointment" ON appointments;
  
  -- Drop tables
  DROP TABLE IF EXISTS appointments;
  DROP TABLE IF EXISTS profiles;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  role text NOT NULL CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (appointment_date) -- Ensures no double bookings
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = auth.uid() 
    AND NOT EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointment_date = EXCLUDED.appointment_date 
      AND status = 'scheduled'
    )
  );

CREATE POLICY "Users can cancel own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    client_id = auth.uid() 
    AND status = 'scheduled'
  )
  WITH CHECK (
    status = 'cancelled'
  );

CREATE POLICY "Admins can update any appointment"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();