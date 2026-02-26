"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, ArrowLeft, Check } from "lucide-react"

type FormState = "idle" | "loading" | "success" | "error"

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
]

export default function SignupPage() {
  const [state, setState] = useState<FormState>("idle")
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(name: string, email: string, pwd: string) {
    const errs: Record<string, string> = {}
    if (!name || name.trim().length < 2)
      errs.name = "Name must be at least 2 characters."
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address."
    if (!pwd || pwd.length < 8)
      errs.password = "Password must be at least 8 characters."
    if (!PASSWORD_RULES[1].test(pwd))
      errs.password = "Password must contain an uppercase letter."
    if (!PASSWORD_RULES[2].test(pwd))
      errs.password = "Password must contain a number."
    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim()
    const pwd = (form.elements.namedItem("password") as HTMLInputElement).value

    const errs = validate(name, email, pwd)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setState("loading")

    // Simulate auth call
    await new Promise((r) => setTimeout(r, 1400))
    setState("success")
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-foreground"
        >
          my-app
        </Link>
        <div className="text-sm text-muted-foreground">
          Have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-accent transition-colors"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {state === "success" ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <svg
                  className="h-7 w-7 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Account created!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Welcome aboard. Your account is ready to use.
                </p>
              </div>
              <Link href="/" className="w-full">
                <Button className="w-full">Go to dashboard</Button>
              </Link>
              <Link
                href="/login"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start building for free. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={state === "loading"}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={state === "loading"}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      disabled={state === "loading"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  )}

                  {/* Live password strength hints */}
                  {password.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {PASSWORD_RULES.map(({ label, test }) => (
                        <li
                          key={label}
                          className={`flex items-center gap-2 text-xs transition-colors ${
                            test(password)
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Check className="h-3 w-3 shrink-0" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full mt-1"
                >
                  {state === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {state === "loading" ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="mt-8 text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
