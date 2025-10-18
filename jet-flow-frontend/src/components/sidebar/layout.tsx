import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import '../../app/(public)/globals.css'
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // redirect to login after logout
  };
  
  return (
    <>
      <SidebarProvider >
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
          <AppSidebar />
          <main className="flex flex-col items-start justify-start min-h-screen w-full pt-19 px-4">
            {/* <SidebarTrigger /> */}
            {children}
          </main>
      </SidebarProvider>
      </>
  )
}