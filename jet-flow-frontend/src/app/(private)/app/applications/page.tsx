"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Layout from "@/components/sidebar/layout";
import FlowLoader from "@/components/loader/FlowLoader";

interface Application {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error("Error fetching user:", userError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("client_applications")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setApplications(data || []);

    setLoading(false);
  };

  const createApplication = async () => {
    if (!newAppName.trim()) return;

    setCreating(true);

    try {
      // Get Supabase auth session token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        setCreating(false);
        return;
      }

      // Get Supabase authenticated user for client_id
      const { data: userData, error: userFetchError } = await supabase.auth.getUser();
      if (userFetchError || !userData?.user) {
        console.error("User fetch error:", userFetchError);
        setCreating(false);
        return;
      }
      const clientId = userData.user.id;

      const token = session.access_token;

      const response = await fetch("http://localhost:8000/api/create-application/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- Pass Bearer token here
        },
        body: JSON.stringify({
          name: newAppName,
          description: newDescription,
          category: newCategory,
          client_id: clientId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewAppName("");
        router.push(`/app/applications/${result.app_id}`);
      } else {
        console.error("Backend error:", result);
      }
    } catch (err) {
      console.error("Create app error:", err);
    }

    setCreating(false);
  };

  if (loading) return <FlowLoader />;

  return (
    <Layout>
      <div className="w-full p-2">
        {/* Create New App */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">

          <input
            type="text"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            placeholder="Application Name"
            className="border p-2 rounded"
          />

          <input
            type="text"
            id="description"
            placeholder="Description"
            className="border p-2 rounded"
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <select
            id="category"
            className="border p-2 rounded"
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="etl">ETL</option>
            <option value="microservice">Microservice</option>
            <option value="automation">Automation</option>
            <option value="workflow">Workflow</option>
          </select>

          <button
            onClick={createApplication}
            disabled={creating}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {creating ? "Creating..." : "Create Application"}
          </button>

        </div>

        {/* App List */}
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="border p-4">
            <h1 className="text-2xl font-bold mb-2">Your Applications</h1>
            <hr className="mb-4"></hr>
          <div className="grid grid-cols-1 max-h-[700px] overflow-y-auto p-4 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => router.push(`/app/applications/${app.id}`)}
              >
                <h2 className="font-semibold">{app.name}</h2>
                <p className="text-sm text-gray-600">{app.description || "No description"}</p>
                <p className="mt-1 text-sm">
                  Status: <strong>{app.status}</strong>
                </p>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </Layout>
  );
}