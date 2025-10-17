import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import '../../app/(public)/globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <header className="w-full fixed top-0 left-0 border-b bg-white shadow-sm z-20">
        <div className="flex items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">JetFlow</span>
            <span className="text-sky-600">Orchestrator</span>
          </h1>
        </div>
      </header>
      <SidebarProvider >
          <AppSidebar />
          <main>
            {/* <SidebarTrigger /> */}
            {children}
          </main>
      </SidebarProvider>
      </>
  )
}