// app/api/webhook/supabase-auth/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

function verify(req: Request) {
  if (!SECRET) return true; // fallback: no verification (not recommended)
  const header = req.headers.get('x-supabase-signature') ?? '';
  // simple equality check — you can instead implement HMAC if you set one up.
  return header === SECRET;
}

export async function POST(req: Request) {
  try {
    if (!verify(req)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const body = await req.json();
    const { type, user } = body as any;

    if (type === 'user.created' && user) {
      // Ensure profile exists
      await supabaseAdmin.from('profiles').upsert({ id: user.id });

      // If user was org signup (metadata), create org+membership
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
  } catch (e: any) {
    console.error('webhook error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}