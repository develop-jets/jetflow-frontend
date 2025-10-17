import { useParams } from 'next/navigation';

export default function OrgDashboard() {
  const params = useParams();
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-gray-600">Org ID: {params.id}</p>
        </div>
      </body>
    </html>
);
}