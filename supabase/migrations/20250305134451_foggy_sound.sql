/*
  # Initial Schema for Barbershop Scheduling System

  1. New Tables
    - users
      - Custom fields for user management
    - appointments
      - Stores appointment information
      - Includes client details and scheduling info
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'client',
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  client_name text NOT NULL,
  appointment_date timestamptz NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_appointment_time UNIQUE (appointment_date)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Clients can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );