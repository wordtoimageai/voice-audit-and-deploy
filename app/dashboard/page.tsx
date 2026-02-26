import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Box,
  Globe,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react"

const PROJECTS = [
  { name: "my-app", status: "Live", updated: "2 mins ago", url: "my-app.vercel.app" },
  { name: "api-service", status: "Live", updated: "1 hour ago", url: "api.my-app.com" },
  { name: "marketing-site", status: "Building", updated: "Just now", url: "—" },
  { name: "docs", status: "Live", updated: "3 days ago", url: "docs.my-app.com" },
]

const STATS = [
  { label: "Total Deploys", value: "1,284", icon: Box },
  { label: "Active Projects", value: "4", icon: Globe },
  { label: "Team Members", value: "3", icon: Users },
  { label: "Page Views (30d)", value: "48.2k", icon: BarChart3 },
]

const STATUS_COLOR: Record<string, string> = {
  Live: "bg-green-500",
  Building: "bg-amber-400",
  Error: "bg-destructive",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background font-sans flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border bg-card shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
            my-app
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Sidebar navigation">
          {[
            { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
            { label: "Projects", icon: Box, href: "/dashboard", active: false },
            { label: "Analytics", icon: BarChart3, href: "/dashboard", active: false },
            { label: "Team", icon: Users, href: "/dashboard", active: false },
            { label: "Settings", icon: Settings, href: "/dashboard", active: false },
          ].map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-base font-semibold text-foreground">Overview</h1>
            <p className="text-xs text-muted-foreground">Welcome back</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New project
          </Button>
        </header>

        <main className="flex-1 px-6 py-8 flex flex-col gap-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Projects table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Projects</h2>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add project
              </Button>
            </div>
            <div className="divide-y divide-border">
              {PROJECTS.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary border border-border shrink-0">
                      <Box className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_COLOR[project.status] ?? "bg-border"}`}
                      />
                      <span className="text-xs text-muted-foreground">{project.status}</span>
                    </div>
                    <span className="hidden md:block text-xs text-muted-foreground">
                      {project.updated}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                      Visit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
