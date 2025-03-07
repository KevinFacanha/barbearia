// This file is kept as a placeholder for when we implement real authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mock.supabase.co';
const supabaseAnonKey = 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);