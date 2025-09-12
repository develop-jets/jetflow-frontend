// app/api/invites/accept/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserByAccessToken } from '@/lib/authHelpers';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || null;
    const user = await getUserByAccessToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { token: inviteToken } = await req.json();
    if (!inviteToken) return NextResponse.json({ error: 'missing token' }, { status: 400 });

    const { data: invite, error: inviteErr } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', inviteToken)
      .single();

    if (inviteErr || !invite) return NextResponse.json({ error: 'Invalid invite' }, { status: 404 });

    if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ error: 'Invite expired' }, { status: 400 });

    // optional: require email match
    if ((invite.email ?? '').toLowerCase() !== (user.email ?? '').toLowerCase()) {
      return NextResponse.json({ error: 'Invite email mismatch' }, { status: 403 });
    }

    // create membership
    const { error: memErr } = await supabaseAdmin.from('memberships').insert({
      user_id: user.id,
      org_id: invite.org_id,
      role: invite.role
    });

    if (memErr) return NextResponse.json({ error: memErr.message }, { status: 500 });

    // delete invite
    await supabaseAdmin.from('invites').delete().eq('id', invite.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('invites/accept', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}