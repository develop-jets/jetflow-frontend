"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Application {
  id: string;
  name: string;
  status: string;
  workflow_count: number;
  max_workflows: number;
}

export default function ApplicationStatusPage() {
  const { id } = useParams(); // application id from route
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAppStatus = async () => {
    try {
      const res = await fetch(`/api/applications/${id}/status/`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch application status");
      }
      const data = await res.json();
      setApp(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAppStatus();
    const interval = setInterval(fetchAppStatus, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!app) return <p>Loading application status...</p>;

  const progressPercentage = app.status === "ready" ? 100 : app.workflow_count / app.max_workflows * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">{app.name}</h2>
      <p className="mb-4">Status: <span className="font-medium">{app.status}</span></p>

      <div className="w-full bg-gray-200 h-6 rounded">
        <div
          className="h-6 bg-green-600 rounded"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="mt-2">{Math.floor(progressPercentage)}% completed</p>

      {app.status === "ready" && (
        <button
          onClick={() => router.push(`/applications/${app.id}`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Application
        </button>
      )}
    </div>
  );
}