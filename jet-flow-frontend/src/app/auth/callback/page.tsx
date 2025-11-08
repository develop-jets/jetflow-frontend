// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import FlowLoader from '@/components/loader/FlowLoader';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // allow older/newer SDKs: parse fragment if available
        type GetSessionFromUrlFn = (opts: { storeSession: boolean }) => Promise<{ data: { session: Session | null } | null; error: unknown }>;

        const maybeGetSessionFromUrl = (supabase.auth as unknown as { getSessionFromUrl?: GetSessionFromUrlFn }).getSessionFromUrl;
        if (typeof maybeGetSessionFromUrl === 'function') {
        // call it and ignore return shape aside from side-effect of storing session
        // (we don't rely on the return value here)
        await maybeGetSessionFromUrl({ storeSession: true });
        }

        // get stored session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session ?? null;

        if (!session) {
          // fallback to waiting briefly for auth state change
          const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
            if (s?.access_token) {
              sub?.subscription?.unsubscribe?.();
              router.replace('/');
            }
          });
          setTimeout(() => sub?.subscription?.unsubscribe?.(), 2500);
          return;
        }

        const accessToken = session.access_token;

        // ask backend for user's orgs and redirect accordingly
        const res = await fetch('/api/user/orgs', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res.ok) {
          const json = await res.json();
          const orgs = json?.orgs ?? [];
          if (orgs.length > 0) {
            const id = orgs[0].organizations?.id ?? orgs[0].org_id ?? orgs[0].org?.id;
            if (id) {
              router.replace(`/dashboard`);
              return;
            }
          }
        }

        // fallback
        router.replace('/dashboard');
      } catch (err) {
        console.error('OAuth callback error', err);
        router.replace('/auth?error=callback');
      }
    }

    handleCallback();
  }, [router]);

  return (<FlowLoader />);
}