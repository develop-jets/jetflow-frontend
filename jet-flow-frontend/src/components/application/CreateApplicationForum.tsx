"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AppFormData {
  name: string;
  description: string;
  category: string;
  client_id: string;
}

export default function CreateApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AppFormData>({
    name: "",
    description: "",
    category: "",
    client_id: "b2739bcc-564c-4c62-9289-29106b131e08",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/create-application/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImU0MzBiNGRlLWNiNDMtNGMyMy04YzcwLWI4OTNkM2U5NDcwOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p1eWFkdW14ZWlkeWlhcXR4Zmt3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiMjczOWJjYy01NjRjLTRjNjItOTI4OS0yOTEwNmIxMzFlMDgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjM4OTQ0LCJpYXQiOjE3NjI2MzUzNDQsImVtYWlsIjoiZGV2ZWxvcGpldHNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImRldmVsb3BqZXRzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJvcmdfbmFtZSI6IkRldmVsb3AgSmV0cyIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic2lnbnVwX3R5cGUiOiJvcmdhbml6YXRpb24iLCJzdWIiOiJiMjczOWJjYy01NjRjLTRjNjItOTI4OS0yOTEwNmIxMzFlMDgifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MjYxODQxOX1dLCJzZXNzaW9uX2lkIjoiYTI1YzM1N2UtYmVjNi00NmY0LWI2ZjUtOTk4NmRmZTE0YjM1IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Gv18paRp83dvWBWNgMRIWgcrIzgVj_d4XW2aZlGSNRRC6guRwTLDnhkF0D8iu_6Xf81AOEfN55fFu70eJNSM8g" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create application");
      }

      const data = await res.json();
      // Redirect to application detail page or dashboard
      router.push(`/applications/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Create New Application</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block font-medium">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-medium">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="col-span-4">
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Application"}
      </button>
    </form>
  );
}