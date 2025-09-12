// app/api/finish-org-signup/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserByAccessToken } from '@/lib/authHelpers';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || null;
    const user = await getUserByAccessToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const org_name = (body?.org_name ?? '').trim();
    if (!org_name) return NextResponse.json({ error: 'org_name required' }, { status: 400 });

    // Create org (return single)
    const { data: orgData, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .insert({ name: org_name })
      .select()
      .single();

    if (orgErr || !orgData) {
      return NextResponse.json({ error: orgErr?.message ?? 'failed to create org' }, { status: 500 });
    }

    // Create membership (owner)
    const { error: memErr } = await supabaseAdmin
      .from('memberships')
      .insert({ user_id: user.id, org_id: orgData.id, role: 'owner' });

    if (memErr) {
      // optionally rollback org; for now return error
      return NextResponse.json({ error: memErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, org: orgData });
  } catch (e: any) {
    console.error('finish-org-signup', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}