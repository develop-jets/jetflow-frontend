'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../../components/profile/ProfileForm';
import FlowLoader from '../../../components/loader/FlowLoader';
import App from 'next/app';
import AppHomePage from '../app/page';

export default function DashboardWrapper() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/'); // redirect to login if not logged in
        return;
      }

      const metadata = session.user.user_metadata as any;
      const userId = session.user.id;

      if (metadata?.signup_type === 'organization') setIsOrgAdmin(true);

      // Fetch profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        setProfileComplete(false);
      } else {
        const mandatoryFields = ['full_name', 'username'];
        if (metadata?.signup_type === 'organization') {
          mandatoryFields.push('org_domain', 'organization_role');
        }

        const filled = mandatoryFields.every((field) => profile[field] && profile[field].trim() !== '');
        setProfileComplete(filled);
      }

      setLoading(false);
    }

    checkProfile();
  }, [router]);

  if (loading) return <FlowLoader />;

  // If profile not complete, show ProfileForm
  if (!profileComplete) return <ProfileForm />;

  // If profile complete, render dashboard
  return <AppHomePage />;
}