// app/api/invites/create/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserByAccessToken } from '@/lib/authHelpers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || null;
    const user = await getUserByAccessToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { org_id, email, role } = body ?? {};
    if (!org_id || !email || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // check caller's membership & role
    const { data: membership, error: membershipErr } = await supabaseAdmin
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('org_id', org_id)
      .single();

    if (membershipErr || !membership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!['owner', 'admin'].includes(membership.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const tokenStr = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

    const { data: inviteData, error: inviteErr } = await supabaseAdmin
      .from('invites')
      .insert({ org_id, email, role, token: tokenStr, expires_at: expiresAt })
      .select()
      .single();

    if (inviteErr || !inviteData) return NextResponse.json({ error: inviteErr?.message ?? 'Failed' }, { status: 500 });

    // TODO: send email with `${process.env.APP_BASE_URL}/auth/invite?token=${tokenStr}`

    return NextResponse.json({ ok: true, invite: inviteData });
  } catch (e: any) {
    console.error('invites/create', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}