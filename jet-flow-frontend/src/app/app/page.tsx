'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // adjust path if needed
import FlowLoader from '../../components/loader/FlowLoader';
import Layout from '@/components/sidebar/layout';
import Image from 'next/image';


export default function AppHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const fadeInClass = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  useEffect(() => {
    // Check if user is logged in
    async function checkUser() {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        // User not logged in, redirect to login
        router.push('/');
      } else {
        setLoading(false);
      }
    }

    checkUser();

    // Optional: listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/'); // redirect if logged out
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // redirect to login after logout
  };

  if (loading) {
    return (
      <html>
        <head>
          <title>Loading...</title>
        </head>
        <body>
          <Layout>
            <FlowLoader />
          </Layout>
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <Layout>          
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
            <p className="text-gray-600 mb-4">You’ve successfully logged in.</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </Layout>
      </body>
    </html>
  );
}