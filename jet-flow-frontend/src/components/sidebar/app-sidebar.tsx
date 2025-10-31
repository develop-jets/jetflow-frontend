import { AppWindowIcon, BugIcon, CircleFadingArrowUp, CirclePlayIcon, CreditCardIcon, HelpCircle, LayoutDashboardIcon, LogsIcon, Plug, Settings, ShieldCheckIcon, TerminalIcon, Users, WorkflowIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Applications",
    url: "/app/applications",
    icon: AppWindowIcon,
  },
  {
    title: "Workflows",
    url: "/app/workflows",
    icon: WorkflowIcon,
  },
  {
    title: "Executions",
    url: "#",
    icon: CirclePlayIcon,
  },
  {
    title: "Debugger",
    url: "#",
    icon: BugIcon,
  },
  {
    title: "Integrations",
    url: "#",
    icon: Plug,
  },
  {
    title: "Deployments",
    url: "#",
    icon: CircleFadingArrowUp,
  },
  {
    title: "Terminal",
    url: "/app/terminals",
    icon: TerminalIcon,
  },
  {
    title: "Logs",
    url: "#",
    icon: LogsIcon,
  },
  {
    title: "Usage & Billing",
    url: "#",
    icon: CreditCardIcon,
  },
  {
    title: "Team Management",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Admin Panel",
    url: "#",
    icon: ShieldCheckIcon,
  },
  {
    title: "Help & Onboarding",
    url: "#",
    icon: HelpCircle,
  }
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors duration-200 ${
                        pathname === item.url ? 'bg-green-400 hover:!bg-green-400' : 'hover:!bg-green-200'
                      }`}
                    >
                      <item.icon />
                      <span >{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <section className="flex justify-center items-center h-50 w-full">
            {/* Background Image */}
            <Image src="/jfo-logo.png" alt="Jetflow Background" width={200} height={200} style={{ objectFit: 'contain', objectPosition: 'bottom' }} priority placeholder="blur" blurDataURL="/jfo.svg" />
          </section>
      </SidebarFooter>
    </Sidebar>
  )
}