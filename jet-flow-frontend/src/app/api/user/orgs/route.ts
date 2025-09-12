// app/api/user/orgs/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserByAccessToken } from '@/lib/authHelpers';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || null;
    const user = await getUserByAccessToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
      .from('memberships')
      .select('org_id, role, organizations(id, name)')
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ orgs: data ?? [] });
  // new
  } catch (err: unknown) {
    console.error('something', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message ?? 'Server error' }, { status: 500 });
  }
}