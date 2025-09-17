// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Se obtienen las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se crea y exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);