"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronDown } from "lucide-react"

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

const STATS = [
  { value: "10x", label: "Faster deploys" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50k+", label: "Developers" },
  { value: "Zero", label: "Config headaches" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.88 0 0 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.88 0 0 / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Announcement badge */}
        <div className="flex justify-start mb-8">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1.5 text-xs font-medium gap-2 cursor-pointer hover:bg-secondary transition-colors"
            onClick={() => scrollTo("#features")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
            New: Built with Next.js 16 and React 19
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </Badge>
        </div>

        {/* Headline */}
        <div className="max-w-3xl">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl leading-[1.05]">
            The complete
            <br />
            platform to
            <br />
            build the web.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Ship production-grade Next.js apps in minutes, not weeks. Full
            TypeScript, shadcn/ui, Vercel Analytics — no shortcuts, no
            workarounds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="h-11 px-8 text-base font-medium"
              onClick={() => scrollTo("#contact")}
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-8 text-base font-medium"
              onClick={() => scrollTo("#features")}
            >
              See how it works
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 gap-px border border-border rounded-xl overflow-hidden md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col gap-1 bg-card px-6 py-5"
            >
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {value}
              </span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollTo("#features")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-label="Scroll to features"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  )
}
