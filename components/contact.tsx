"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Loader2, Mail, MessageSquare, User } from "lucide-react"

type FormState = "idle" | "loading" | "success" | "error"

export function Contact() {
  const [state, setState] = useState<FormState>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(data: FormData) {
    const errs: Record<string, string> = {}
    const name = (data.get("name") as string)?.trim()
    const email = (data.get("email") as string)?.trim()
    const message = (data.get("message") as string)?.trim()

    if (!name || name.length < 2) errs.name = "Name must be at least 2 characters."
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address."
    if (!message || message.length < 10)
      errs.message = "Message must be at least 10 characters."

    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const errs = validate(data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setState("loading")

    // Simulate async send
    await new Promise((r) => setTimeout(r, 1200))
    setState("success")
  }

  return (
    <section id="contact" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left copy */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
                Contact
              </p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Let's build something together
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground text-lg">
                Have a question, want a demo, or just want to say hello? Fill
                in the form and we'll be in touch within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: Mail, text: "hello@my-app.com" },
                { icon: MessageSquare, text: "Live chat available Mon–Fri 9am–5pm" },
                { icon: User, text: "Dedicated onboarding for Pro and Enterprise" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-xl border border-border bg-card p-8">
            {state === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <CheckCircle className="h-12 w-12 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">
                  Message sent!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Thanks for reaching out. We'll get back to you within one
                  business day.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setState("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-name">Full name</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                    disabled={state === "loading"}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-destructive mt-0.5">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-email">Email address</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                    disabled={state === "loading"}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-destructive mt-0.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us what you're building..."
                    rows={4}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    aria-invalid={!!errors.message}
                    disabled={state === "loading"}
                    className="resize-none"
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-destructive mt-0.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                {state === "error" && (
                  <p className="text-sm text-destructive">
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full mt-2"
                >
                  {state === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {state === "loading" ? "Sending..." : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
