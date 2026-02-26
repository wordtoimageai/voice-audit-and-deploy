import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Box, Layers, Zap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Next.js 16",
    description:
      "Built on the latest Next.js with App Router, React 19, and Turbopack for instant hot module replacement.",
  },
  {
    icon: Layers,
    title: "shadcn/ui",
    description:
      "A full suite of accessible, composable UI components built on Radix primitives and Tailwind CSS.",
  },
  {
    icon: Box,
    title: "Deploy-ready",
    description:
      "TypeScript strict mode, Vercel Analytics, and a clean next.config — no workarounds, no shortcuts.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            my-app
          </span>
          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#stack"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Stack
            </a>
            <Button size="sm">
              Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-20">
        <div className="flex flex-col items-start gap-6 md:items-center md:text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            Production ready
          </Badge>

          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Build fast.
            <br />
            Ship with confidence.
          </h1>

          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
            A clean, audited Next.js 16 starter — strict TypeScript, full
            shadcn/ui component library, Vercel Analytics, and zero build
            workarounds.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">
              Start building <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 flex flex-col gap-2 md:items-center md:text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Everything you need
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            The starter is pre-configured with the tools that matter, and
            nothing that doesn't.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Stack */}
      <section id="stack" className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 flex flex-col gap-2 md:items-center md:text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Stack
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Each dependency was chosen for stability, longevity, and developer
            experience.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Next.js", version: "16.1.6" },
            { name: "React", version: "19.2.4" },
            { name: "TypeScript", version: "5.7.3" },
            { name: "Tailwind CSS", version: "4.2.0" },
            { name: "shadcn/ui", version: "latest" },
            { name: "Radix UI", version: "latest" },
            { name: "Lucide React", version: "0.564.0" },
            { name: "Vercel Analytics", version: "1.6.1" },
          ].map(({ name, version }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">{name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {version}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm font-semibold text-foreground">my-app</span>
          <p className="text-xs text-muted-foreground">
            Built with Next.js 16 and deployed on Vercel.
          </p>
        </div>
      </footer>
    </main>
  )
}
