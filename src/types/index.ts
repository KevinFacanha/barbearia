export interface Appointment {
  id: string;
  user_id: string;
  client_name: string;
  appointment_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'admin';
}