// lib/authHelpers.ts
import { supabaseAdmin } from './supabaseAdmin';

export async function getUserByAccessToken(token?: string | null) {
  if (!token) return null;
  // pass access token to admin client to get user (this is allowed)
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}