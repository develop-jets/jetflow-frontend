// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // allow older/newer SDKs: parse fragment if available
        if (typeof (supabase.auth as any).getSessionFromUrl === 'function') {
          await (supabase.auth as any).getSessionFromUrl({ storeSession: true });
        }

        // get stored session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session ?? null;

        if (!session) {
          // fallback to waiting briefly for auth state change
          const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
            if (s?.access_token) {
              sub?.subscription?.unsubscribe?.();
              router.replace('/app');
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
              router.replace(`/app/org/${id}`);
              return;
            }
          }
        }

        // fallback
        router.replace('/app');
      } catch (err) {
        console.error('OAuth callback error', err);
        router.replace('/auth?error=callback');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Finishing sign-in...
    </div>
  );
}