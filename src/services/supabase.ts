import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export interface Recording {
  id: string;
  summary: string;
  nodes: unknown[];
  edges: unknown[];
  created_at: string;
}
