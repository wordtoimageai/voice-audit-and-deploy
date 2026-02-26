"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"

type FormState = "idle" | "loading" | "success" | "error"

export default function LoginPage() {
  const [state, setState] = useState<FormState>("idle")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState("")

  function validate(email: string, password: string) {
    const errs: Record<string, string> = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address."
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 characters."
    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const errs = validate(email, password)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setErrorMessage("")
    setState("loading")
    await new Promise((r) => setTimeout(r, 1200))
    setState("success")
  }

  async function handleForgotPassword(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const emailInput = (document.getElementById("email") as HTMLInputElement)?.value?.trim()
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setErrors((prev) => ({ ...prev, email: "Enter your email above first." }))
      return
    }
    setErrors({})
    setForgotSent(true)
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
        <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
          my-app
        </Link>
        <div className="text-sm text-muted-foreground">
          No account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline underline-offset-4 hover:text-accent transition-colors"
          >
            Sign up
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
                  Welcome back!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  You have been signed in successfully.
                </p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          ) : forgotSent ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Check your email
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists, we sent a password reset link.
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setForgotSent(false)}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Log in to your account
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email and password to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-xs text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}

                <Button type="submit" disabled={state === "loading"} className="w-full mt-1">
                  {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {state === "loading" ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="mt-8 text-center text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
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
