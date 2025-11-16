"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/sidebar/layout";
import { subscribeAppEvents } from "@/lib/realtime/subscribeEvent";
import React from "react";
import FlowLoader from "@/components/loader/FlowLoader";
import { supabase } from "@/lib/supabaseClient";

interface Application {
  id: string;
  name: string;
  description?: string;
  status: string;
  docker_image?: string;
  created_at: string;
  updated_at: string;
}

interface PageParams {
  id: string;
}

export default function ApplicationDetails({ params }: { params: Promise<PageParams> }) {
  const { id: appId } = React.use(params);

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchApp();
    // Subscribe to live updates
    const unsubscribe = subscribeAppEvents(appId, (update) => {
      // Example backend emits { app_id, message, status?, docker_image? }
      setLogs((prev) => [...prev, update.message]);

      // If backend sends status or docker_image updates, merge them
      setApp((prev) =>
        prev
          ? {
              ...prev,
              status: update.status || prev.status,
              docker_image: update.docker_image || prev.docker_image,
            }
          : prev
      );
      if (update.message === "Status updated: completed") {
        fetchApp();
      }
    });

    return () => unsubscribe();
  }, [appId]);

  const fetchApp = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_applications")
      .select("*")
      .eq("id", appId)
      .single();

    if (error) console.error(error);
    else setApp(data);

    setLoading(false);
  };

  if (loading || !app) return <FlowLoader />;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">{app.name}</h1>
        <p className="text-gray-600 mt-1">{app.description || "No description."}</p>

        {/* STATUS */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Status</h2>
          <div
            className={`mt-2 inline-block px-3 py-1 rounded text-white ${
              app.status === "ready"
                ? "bg-green-600"
                : app.status === "failed"
                ? "bg-red-600"
                : "bg-yellow-600"
            }`}
          >
            {app.status.toUpperCase()}
          </div>
        </div>

        {/* Docker */}
        {app.docker_image && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Docker Image</h2>
            <p className="mt-1 bg-gray-100 p-2 rounded text-sm">{app.docker_image}</p>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Live Updates</h2>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {logs.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Application Details</h2>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <p>
              <strong>Created:</strong> {new Date(app.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong> {new Date(app.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}