// src/app/(public)/page.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import FlowLoader from '../../components/loader/FlowLoader';

type GetSessionFromUrlFn = (opts: { storeSession: boolean }) => Promise<{ data: { session: Session | null } | null; error: unknown }>;

// Ensure this component does NOT render <html> or <body> tags.
// This should only render content under <main>.
export default function DefaultLandingPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // auth states
  const [signup_email, set_signup_Email] = useState('');
  const [signup_password, set_signup_Password] = useState('');
  const [login_email, set_login_Email] = useState('');
  const [login_password, set_login_Password] = useState('');
  const [orgName, setOrgName] = useState(''); // inline org name
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // faster for dev
    setLoaded(true);
    return () => clearTimeout(timer);
  }, []);
  // Redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session) {
        // ✅ User already logged in — redirect to app
        router.push('/pending-profile');
      }
    }

    checkSession();

    // Also listen for auth state changes (optional)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/pending-profile');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <FlowLoader />;

  const fadeInClass = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  function clearMessages() {
    setError(null);
  }

  // Helper to check if user exists by email using signInWithPassword with dummy password
  async function checkIfUserExists(email: string): Promise<boolean> {
    try {
      const res = await fetch('/api/user/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return data.exists;
    } catch (err) {
      console.error('Error checking user existence:', err);
      return false;
    }
  }

  async function handleIndividualSignup() {
    clearMessages();
    if (!signup_email || !signup_password) {
      setError('Provide email and password to sign up.');
      return;
    }
    const exists = await checkIfUserExists(signup_email);
    if (exists) {
      setError('Email already exists. Please login instead.');
      return;
    }
    try {
      setBusy(true);

      // signUp shape for supabase-js v2: single object with options.data
      const { data: _data, error: signUpError } = await supabase.auth.signUp({
        email: signup_email,
        password: signup_password,
        options: { data: { signup_type: 'individual' } }
      });

      if (signUpError) throw signUpError;

      router.push('/auth/check-email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'Signup failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleOrgSignup() {
    clearMessages();
    if (!signup_email || !signup_password) {
      setError('Provide email and password to sign up.');
      return;
    }
    const exists = await checkIfUserExists(signup_email);
    if (exists) {
      setError('Email already exists. Please login instead.');
      return;
    }

    if (!orgName) {
      setError('Enter your organization name below before clicking Organization Account.');
      return;
    }

    try {
      setBusy(true);

      const { data: _data, error } = await supabase.auth.signUp({
        email: signup_email,
        password: signup_password,
        options: { data: { signup_type: 'organization', org_name: orgName } }
      });

      if (error) throw error;

      router.push('/auth/check-email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'Organization signup failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    clearMessages();
    if (!login_email || !login_password) {
      setError('Enter email and password.');
      return;
    }

    try {
      setBusy(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email: login_email, password: login_password });
      if (error) throw error;

      const session = data?.session;
      const user = data?.user;
      if (!session || !user) {
        setError('No session returned from login.');
        return;
      }

      const accessToken = session.access_token;

      // 1) Check memberships using server endpoint (server uses service role)
      const res = await fetch('/api/user/orgs', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.ok) {
        const json = await res.json();
        const orgs = json?.orgs ?? [];
        if (orgs.length > 0) {
          // redirect to first org (you can implement org selection UX)
          const firstOrg = orgs[0];
          // handle different shapes from server
          const id = firstOrg.organizations?.id ?? firstOrg.org_id ?? firstOrg.org?.id;
          if (id) {
            router.push('/dashbaord');
            return;
          }
        }
      }

      // 2) If no orgs, but user.signup_type metadata present, call finish-org-signup
      const signupType = (user.user_metadata as any)?.signup_type; // user_metadata shape unknown; keep as minimal cast
      const orgNameMetadata = (user.user_metadata as any)?.org_name;
      if (signupType === 'organization' && orgNameMetadata) {
        const finishRes = await fetch('/api/finish-org-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ org_name: orgNameMetadata })
        });

        if (finishRes.ok) {
          const body = await finishRes.json();
          const org = body?.org;
          if (org?.id) {
            router.push('/dashbaord');
            return;
          }
        } else {
          console.warn('finish-org-signup returned', await finishRes.text());
        }
      }

      router.push('/pending-profile');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotPassword() {
    clearMessages();
    if (!login_email) {
      setError('Enter your email to reset the password.');
      return;
    }
    try {
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(login_email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
      alert('If that account exists, a password reset email has been sent.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'Password reset failed');
    } finally {
      setBusy(false);
    }
  }

  function providerNameForButton(providerKey: string) {
    if (providerKey === 'microsoft') return 'azure';
    return providerKey; // google, apple
  }

  async function handleSSO(providerKey: string) {
    clearMessages();
    try {
      setBusy(true);
      const provider = providerNameForButton(providerKey);

      // typed helper for possibly-existing getSessionFromUrl is used in callback page, not here.
      await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'SSO failed');
    } finally {
      setBusy(false);
    }
  }

  // Do NOT render <html> or <body> here; only render content under <main>.
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {busy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <FlowLoader />
        </div>
      )}
      {/* Header */}
      <header className="w-full fixed top-0 left-0 border-b bg-white shadow-sm z-20">
        <div className="flex items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">JetFlow</span>
            <span className="text-sky-600">Orchestrator</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center text-center px-6 mt-16">
        {/* Background Image */}
        <Image src="/jfo.png" alt="Jetflow Background" fill style={{ objectFit: 'contain' }} priority placeholder="blur" blurDataURL="/jfo_blur.png" />

        <div className="absolute inset-0 bg-gradient-to-b from-green-300/70 via-green-400/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto transition-all duration-700 ease-out transform">
          <h2 className={clsx('text-6xl font-extrabold text-black drop-shadow-lg transition-all duration-700', fadeInClass)}>
            Jetflow Orchestrator
          </h2>
          <p className={clsx('mt-4 text-lg text-black transition-all duration-700', fadeInClass)}>
            Build, manage, and orchestrate your workflows seamlessly.
            <br />
            Powerful, scalable, and developer-friendly. No Code. No Hassle.
          </p>

          <div className={clsx('mt-12 flex flex-wrap justify-center items-start gap-8', fadeInClass)}>
            {/* Signup Card */}
            <div className="p-8 w-full md:w-[500px] bg-white rounded-lg shadow-sm transition-all duration-700 transform">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h3>
              <p className="text-gray-600 mb-6">Choose your account type to get started.</p>

              <div className="mb-4 align-left">
                <label className="block text-sm text-left font-bold mb-1 text-gray-700">Email</label>
                <input type="email" placeholder="Enter your email" value={signup_email} onChange={(e) => set_signup_Email(e.target.value)} className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none" />
              </div>
              <div className="mb-4 align-left">
                <label className="block text-sm text-left font-bold mb-1 text-gray-700">Password</label>
                <input type="password" placeholder="Enter your password" value={signup_password} onChange={(e) => set_signup_Password(e.target.value)} className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none" />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-left font-bold mb-1 text-gray-700">Organization name (for Organization signup)</label>
                <input type="text" placeholder="Acme Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none" />
              </div>

              <button className="w-full h-11 mb-4 flex items-center justify-center font-bold text-sm rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 bg-white" onClick={handleIndividualSignup} disabled={busy}>
                Individual Account
              </button>

              <button className="w-full h-11 mb-4 flex items-center justify-center font-bold text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600" onClick={handleOrgSignup} disabled={busy}>
                Organization Account
              </button>
            </div>

            {/* Login Card */}
            <div className="p-8 w-full md:w-[500px] bg-white rounded-lg shadow-sm transition-all duration-700 transform">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Login</h3>

              <div className="mb-4 align-left">
                <label className="block text-sm text-left font-bold mb-1 text-gray-700">Email</label>
                <input type="email" placeholder="Enter your email" value={login_email} onChange={(e) => set_login_Email(e.target.value)} className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none" />
              </div>
              <div className="mb-4 align-left">
                <label className="block text-sm text-left font-bold mb-1 text-gray-700">Password</label>
                <input type="password" placeholder="Enter your password" value={login_password} onChange={(e) => set_login_Password(e.target.value)} className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none" />
              </div>

              <div className="mb-4 text-right">
                <button className="text-sm text-blue-500 hover:underline font-medium" onClick={handleForgotPassword} disabled={busy}>
                  Forgot password?
                </button>
              </div>

              <button onClick={(e) => handleLogin(e)} className="w-full h-11 flex items-center justify-center font-bold text-sm rounded-md mb-6 bg-blue-500 text-white hover:bg-blue-600" disabled={busy}>
                Login
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex justify-between gap-4">
                <button className="flex items-center justify-center gap-2 w-1/3 h-11 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => handleSSO('google')} disabled={busy}>
                  <Image src="/icons/google.svg" alt="google" width={20} height={20} />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 w-1/3 h-11 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => handleSSO('microsoft')} disabled={busy}>
                  <Image src="/icons/microsoft.svg" alt="microsoft" width={20} height={20} />
                  <span className="text-sm font-medium text-gray-700">Microsoft</span>
                </button>
                <button className="flex items-center justify-center gap-2 w-1/3 h-11 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => handleSSO('apple')} disabled={busy}>
                  <Image src="/icons/apple.svg" alt="apple" width={20} height={20} />
                  <span className="text-sm font-medium text-gray-700">Apple</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 text-center text-red-600">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-2 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="grid grid-cols-3 gap-12">
            {['Product', 'Resources', 'Company'].map((section) => (
              <div key={section}>
                <a className="text-sm font-semibold text-gray-900 uppercase mb-4">{section}</a>
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {['github', 'linkedin', 'youtube'].map((icon) => (
              <a key={icon} href="#" aria-label={icon} className="text-gray-500 hover:text-blue-500">
                <Image src={`/icons/${icon}.svg`} alt={icon} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}