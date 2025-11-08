'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; 
import FlowLoader from '../../../../components/loader/FlowLoader';
import Layout from '@/components/sidebar/layout';
import { PlusIcon } from 'lucide-react';

export default function AppHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const fadeInClass = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
  const [applications, setApplications] = useState<any[]>([]);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push('/');
      } else {
        setLoading(false);
      }
    }

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/');
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    async function fetchApplications() {
      try {
        // Temporary dummy data for testing
        const dummyData = [
          { id: 1, name: 'Workflow Automation Engine', created_at: '2025-09-25T10:30:00Z', updated_at: '2025-10-10T15:20:00Z' },
          { id: 2, name: 'AI Task Orchestrator', created_at: '2025-08-12T09:15:00Z', updated_at: '2025-09-28T11:45:00Z' },
          { id: 3, name: 'Data Insight Dashboard', created_at: '2025-07-05T13:00:00Z', updated_at: '2025-07-20T17:10:00Z' },
        ];
        setApplications(dummyData);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setAppLoading(false);
      }
    }
    fetchApplications();
  }, []);

  if (loading) {
    return (
            <FlowLoader />
    );
  }

  return (
    <html>
      <head>
        <title>Application Management</title>
      </head>
      <body>
        <Layout>
          {/* <div className="ml-3">
            <h1 className="text-3xl font-semibold">Application Management</h1>
          </div>      */}

          {/* Existing 4 KPI Cards */}
          <div className="mt-2 w-full">
            <div className="bg-white pl-4 rounded-xl flex flex-col justify-between h-full">
                <div className='flex justify-between items-center'>
                    <div className="text-black-500 text-[30px] font-bold">Application Management</div>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                        <PlusIcon />
                        <span>Create Application</span>
                    </button>
                </div>
            </div>
          </div>
          <hr className="border-t-2 border-gray-300 my-4" />

          {/* Application List Section */}
          <div className="mt-4 bg-white rounded-xl p-4 w-full">
            {appLoading ? (
              <p className="text-gray-500">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-500">No applications found. Create one to get started!</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-gray-900">{app.name}</span>
                      <span className="text-sm text-gray-500">
                        Created: {new Date(app.created_at).toLocaleDateString()} | Modified: {new Date(app.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={() => router.push(`/app/applications/edit/${app.id}`)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-4 1 1-4 9-9a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414l-9 9z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 flex items-center"
                        onClick={async () => {
                          const confirmDelete = confirm('Are you sure you want to delete this application?');
                          if (confirmDelete) {
                            const { error } = await supabase.from('applications').delete().eq('id', app.id);
                            if (!error) {
                              setApplications((prev) => prev.filter((a) => a.id !== app.id));
                            } else {
                              console.error('Delete failed:', error);
                            }
                          }
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Layout>
      </body>
    </html>
  );
}