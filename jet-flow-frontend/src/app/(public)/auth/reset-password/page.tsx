'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleResetPassword() {
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError('Please fill out both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setBusy(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => router.push('/'), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Password reset failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 overflow-hidden">
      <header className="w-full fixed top-0 left-0 border-b bg-white shadow-sm z-20">
        <div className="flex items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">JetFlow</span>
            <span className="text-sky-600">Orchestrator</span>
          </h1>
        </div>
      </header>
      {/* Background Section */}
      <div className="absolute inset-0">
        <Image
          src="/jfo.png"
          alt="Jetflow Background"
          fill
          style={{ objectFit: 'contain' }}
          priority
          placeholder="blur"
          blurDataURL="/jfo_blur.png"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-300/70 via-green-400/40 to-transparent" />
      </div>

      {/* Foreground Form */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Re-enter password"
          />
        </div>

        <button
          onClick={handleResetPassword}
          disabled={busy}
          className="w-full h-11 flex items-center justify-center font-bold text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          {busy ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </main>
  );
}