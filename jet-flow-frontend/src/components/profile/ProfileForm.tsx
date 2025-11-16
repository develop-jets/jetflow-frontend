'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Profile {
  full_name?: string;
  username?: string;
  contact_number?: string;
  address?: string;
  org_domain?: string;
  organization_role?: string;
  title?: string;
  bio?: string;
  country?: string;
  organization_name?: string;
  profile_image_url?: string;
  is_org_admin?: boolean;
  avatar_url?: string;
}


export default function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({});
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState(0);
  const [metsdata, setMetadata] = useState<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // redirect to login after logout
  };

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const metadata = session.user.user_metadata as any;
        if (metadata?.signup_type === 'organization') {
          setIsOrgAdmin(true);
          setMetadata(metadata);
          setProfile({ ...profile,
            is_org_admin: isOrgAdmin,
            organization_name: metadata.org_name, 
          })
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setProfile({ ...profile,
            is_org_admin: false,
            full_name: metadata.full_name,
            profile_image_url: metadata.avatar_url,
            avatar_url: metadata.avatar_url,
          })
        }
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    const allFields: (keyof Profile)[] = ['full_name', 'username', 'contact_number', 'address', 'title', 'bio', 'country', 'profile_image_url'];

    const filledCount = allFields.filter((f) => {
      const value = profile[f]; 
      return typeof value === 'string' && value.trim() !== '';
    }).length;
    setCompletion(Math.round((filledCount / allFields.length) * 100));
  }, [profile]);

  const mandatoryFields: (keyof Profile)[] = ['full_name', 'username'];
  if (isOrgAdmin) mandatoryFields.push('org_domain', 'organization_role');
  const canSave = mandatoryFields.every((f) => {
    const value = profile[f]; 
      return typeof value === 'string' && value.trim() !== '';
    });

  async function handleSave() {
    if (!canSave) {
      setError('Please fill all mandatory fields before saving.');
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const { data, error } = await supabase.from('profiles').upsert({
        id: (await supabase.auth.getSession()).data.session?.user.id,
        ...profile
      });
      console.log('Upsert result:', data, error);

      if (error) throw error;
      alert('Profile saved successfully!');
      router.push('/app');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message ?? 'Failed to save profile');
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
          <button
            onClick={handleLogout}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition items-end ml-auto"
          >
            Logout
          </button>
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
      <div className='relative z-10 bg-white rounded-lg shadow-md'>
      <div className="max-w-10xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">Complete Your Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <label htmlFor="full_name" className="mb-2 font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your full name"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-semibold text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Choose a username"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="avatar_url" className="mb-2 font-semibold text-gray-700">
              {(metsdata?.signup_type === 'organization') ? "Logo URL" : "Profile Image URL"}
            </label>
            <input
              id="avatar_url"
              type="text"
              value={profile.profile_image_url || ''}
              onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Link to your avatar image"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="contact" className="mb-2 font-semibold text-gray-700">
              Contact
            </label>
            <input
              id="contact"
              type="text"
              value={profile.contact_number || ''}
              onChange={(e) => setProfile({ ...profile, contact_number: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your contact details"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-2 font-semibold text-gray-700">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your address"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 font-semibold text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={profile.title || ''}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your professional title"
            />
          </div>

          <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-4">
            <label htmlFor="bio" className="mb-2 font-semibold text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-4">
            <label htmlFor="website" className="mb-2 font-semibold text-gray-700">
              Website
            </label>
            <input
              id="website"
              type="text"
              value={profile.org_domain || ''}
              onChange={(e) => setProfile({ ...profile, org_domain: e.target.value })}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your website URL"
            />
          </div>

          {isOrgAdmin && (
            <>
              <div className="flex flex-col">
                <label htmlFor="org_contact" className="mb-2 font-semibold text-gray-700">
                  Organization Contact <span className="text-red-500">*</span>
                </label>
                <input
                  id="org_contact"
                  type="text"
                  value={profile.organization_role || ''}
                  onChange={(e) => setProfile({ ...profile, organization_role: e.target.value })}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Organization contact info"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="org_address" className="mb-2 font-semibold text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="org_address"
                  type="text"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Organization address"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <label className="block mb-2 font-semibold text-gray-700">Profile Completion</label>
          <div className="w-full bg-gray-200 h-5 rounded-lg overflow-hidden">
            <div
              className="bg-green-600 h-5 rounded-lg transition-all duration-300"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 mt-1 block">{completion}% completed</span>
        </div>

        {error && <div className="mt-6 text-red-600 font-semibold">{error}</div>}

        <button
          onClick={handleSave}
          disabled={busy || !canSave}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {busy ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
      </div>
    </main>
  );
}