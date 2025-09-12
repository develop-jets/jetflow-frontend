// src/app/api/webhook/supabase-auth/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const SECRET = process.env.SUPABASE_WEBHOOK_SECRET ?? '';

function verify(req: Request) {
  if (!SECRET) return true; // fallback (not recommended in prod)
  const header = req.headers.get('x-supabase-signature') ?? '';
  return header === SECRET;
}

export async function POST(req: Request) {
  try {
    if (!verify(req)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const body = await req.json();
    const type = (body as any)?.type as string | undefined; // limited use of any here because webhook payload is dynamic
    const user = (body as any)?.user;

    if (type === 'user.created' && user) {
      // ensure profile exists
      await supabaseAdmin.from('profiles').upsert({ id: user.id });

      const signupType = user?.user_metadata?.signup_type;
      const orgName = user?.user_metadata?.org_name;

      if (signupType === 'organization' && orgName) {
        const { data: org, error: orgErr } = await supabaseAdmin
          .from('organizations')
          .insert({ name: orgName })
          .select()
          .single();

        if (!orgErr && org) {
          await supabaseAdmin.from('memberships').insert({
            user_id: user.id,
            org_id: org.id,
            role: 'owner'
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('webhook error', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message ?? 'Server error' }, { status: 500 });
  }
}