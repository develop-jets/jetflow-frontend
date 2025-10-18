// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

if (!serviceRole) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
export const supabaseAdmin = createClient(url, serviceRole);