import { Zap, Layers, ShieldCheck, BarChart3, Cpu, Globe } from "lucide-react"

const FEATURES = [
  {
    icon: Zap,
    title: "Instant deploys",
    description:
      "Push to Git and your app is live in seconds. No manual CI setup, no YAML wrestling.",
  },
  {
    icon: Layers,
    title: "shadcn/ui included",
    description:
      "Forty-plus accessible, composable components built on Radix primitives and Tailwind CSS v4.",
  },
  {
    icon: ShieldCheck,
    title: "TypeScript strict",
    description:
      "Full strict mode enabled. Build errors surface at compile time, not in production.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    description:
      "Vercel Analytics is pre-wired. Understand your real users without adding a single script tag.",
  },
  {
    icon: Cpu,
    title: "React 19 + Turbopack",
    description:
      "Server Components, Actions, and Suspense out of the box with the fastest local dev bundler.",
  },
  {
    icon: Globe,
    title: "Edge-ready",
    description:
      "Deploy to 100+ global edge locations. Your users always hit a server close to them.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-sm font-semibold text-accent mb-3 uppercase tracking-widest">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything a production app needs
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground text-lg">
            Pre-configured with the tools that matter, and nothing that
            doesn't.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-px bg-border rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-secondary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border group-hover:border-accent/30 transition-colors">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
