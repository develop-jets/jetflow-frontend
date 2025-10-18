'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; 
import FlowLoader from '../../components/loader/FlowLoader';
import Layout from '@/components/sidebar/layout';
import { CircleCheckBig, IndianRupeeIcon, PlusIcon, SparklesIcon, WebhookIcon, WorkflowIcon } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AppHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const fadeInClass = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

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

  if (loading) {
    return (
      <html>
        <head>
          <title>Loading...</title>
        </head>
        <body>
          {/* <Layout> */}
            <FlowLoader />
          {/* </Layout> */}
        </body>
      </html>
    );
  }

  // Line chart data
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'API Calls',
        data: [5000, 6000, 4500, 7000, 8000, 9000, 10000, 9500, 8500, 9000, 9200, 9700],
        borderColor: 'rgb(3, 246, 51)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // hide the dataset label
      title: {
        display: true,
        text: 'API Calls Over Time',
        font: { size: 18 },
        color: '#000000', // black title
        align: 'start' as const,
        padding: { top: 0, bottom: 30 },
      },
    },
    scales: {
      x: {
        grid: { display: false }, // remove vertical lines
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 3000 },
        grid: { display: true }, // horizontal lines only
      },
    },
  };

  return (
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <Layout>
          <div className="ml-3">
            <h1 className="text-3xl font-semibold">Welcome, Yash Gaur!</h1>
          </div>     

          {/* Existing 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-1 w-full">
            <div className="bg-white p-6 rounded-xl border-1 border-gray-200 m-3 flex flex-col justify-between min-h-[150px] h-full">
              <div className='flex justify-between items-center h-10 mb-2'>
                <div className="text-gray-500 font-small font-semibold">Total Workflows Active</div>
                <WorkflowIcon className='flex items-center justify-center text-sky-500' />
              </div>
              <div className="text-4xl font-bold">2,424</div>
              <div className="text-gray-400 font-small">Running workflows across all projects</div>
            </div>

            <div className="bg-white p-6 rounded-xl border-1 border-gray-200 m-3 flex flex-col justify-between min-h-[150px] h-full">
              <div className='flex justify-between items-center h-10 mb-2'>
                <div className="text-gray-500 font-small font-semibold">API Calls this Month</div>
                <WebhookIcon className='flex items-center justify-center text-purple-500' />
              </div>
              <div className="text-4xl font-bold">5,67,800</div>
              <div className="text-gray-400 font-small">+18.2% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-xl border-1 border-gray-200 m-3 flex flex-col justify-between min-h-[150px] h-full">
              <div className='flex justify-between items-center h-10 mb-2'>
                <div className="text-gray-500 font-small font-semibold">Cost this Month</div>
                <IndianRupeeIcon className='flex items-center justify-center text-yellow-500' />
              </div>
              <div className="text-4xl font-bold">₹55,690</div>
              <div className="text-gray-400 font-small">Estimated cost based on usage</div>
            </div>

            <div className="bg-white p-6 rounded-xl border-1 border-gray-200 m-3 flex flex-col justify-between min-h-[150px] h-full">
              <div className='flex justify-between items-center h-10 mb-2'>
                <div className="text-gray-500 font-small font-semibold">Execution Success Rate</div>
                <CircleCheckBig className='flex items-center justify-center text-green-500' />
              </div>
              <div className="text-4xl font-bold">98.7%</div>
              <div className="text-gray-400 font-small">Across all active workflows runs</div>
            </div>
          </div>

          {/* New 60:40 Section */}
          <div className="flex w-full gap-6 ml-3 mt-6">
            {/* Left 60% - Line Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200" style={{ flex: '0 0 60%' }}>
              <Line data={lineData} options={lineOptions} />
            </div>

            {/* Right 40% - Button */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center" style={{ flex: '0 0 37%' }}>
              <SparklesIcon className='h-20 w-20 text-green-600 my-6' />
              <div className="text-dark text-3xl font-bold mb-4 text-center">Build your First Workflow</div>
              <div className="text-gray-500 mb-6 text-center">Drag and drop nodes to automate any process, no code required.</div>
              <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2">
                <WorkflowIcon />
                <PlusIcon />
                <span>Create Workflow</span>
              </button>
            </div>
          </div>

        </Layout>
      </body>
    </html>
  );
}