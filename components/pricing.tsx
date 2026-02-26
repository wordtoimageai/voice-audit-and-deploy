"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For personal projects and side experiments.",
    features: [
      "3 projects",
      "100 deploys / month",
      "Community support",
      "Vercel Analytics (limited)",
      "1 team member",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 20,
    annualPrice: 16,
    description: "For professional developers shipping real products.",
    features: [
      "Unlimited projects",
      "Unlimited deploys",
      "Priority email support",
      "Full Vercel Analytics",
      "Up to 10 team members",
      "Custom domains",
      "99.9% uptime SLA",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "For teams that need security, scale, and SLAs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated support",
      "Custom contracts",
      "Unlimited team members",
      "SLA guarantees",
      "Audit logs",
    ],
    cta: "Contact sales",
    href: "#contact",
    highlighted: false,
  },
]

function scrollToContact() {
  const el = document.querySelector("#contact")
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground text-lg">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((a) => !a)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                annual ? "bg-foreground" : "bg-border"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-background shadow transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
              <span className="sr-only">Toggle annual billing</span>
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 flex items-center gap-1.5",
                annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
              <Badge className="text-xs px-1.5 py-0 bg-accent text-accent-foreground border-0 font-medium">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-8",
                plan.highlighted
                  ? "border-foreground bg-foreground text-primary-foreground shadow-lg"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 text-xs font-semibold px-3 py-1">
                  Most popular
                </Badge>
              )}

              <div className="mb-6">
                <p
                  className={cn(
                    "text-sm font-semibold mb-1",
                    plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  {plan.monthlyPrice === null ? (
                    <span className="text-4xl font-bold tracking-tight">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight">
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span
                        className={cn(
                          "text-sm mb-1.5",
                          plan.highlighted
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        )}
                      >
                        / mo
                      </span>
                    </>
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    plan.highlighted
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        plan.highlighted ? "text-primary-foreground" : "text-accent"
                      )}
                    />
                    <span
                      className={
                        plan.highlighted
                          ? "text-primary-foreground/90"
                          : "text-foreground"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.href === "#contact" ? (
                <Button
                  onClick={scrollToContact}
                  variant={plan.highlighted ? "secondary" : "outline"}
                  className={cn(
                    "w-full font-medium",
                    plan.highlighted && "bg-background text-foreground hover:bg-secondary"
                  )}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  variant={plan.highlighted ? "secondary" : "outline"}
                  className={cn(
                    "w-full font-medium",
                    plan.highlighted && "bg-background text-foreground hover:bg-secondary"
                  )}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
