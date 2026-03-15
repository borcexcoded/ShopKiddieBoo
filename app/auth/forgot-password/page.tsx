"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KiddieBookLogo } from "@/components/kiddieboo/logo"
import { toast } from "sonner"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)
    if (error) {
      toast.error("Failed to send reset email", { description: error.message })
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center animate-fade-in-up">
          <div className="mb-6">
            <Link href="/">
              <KiddieBookLogo className="text-3xl" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-xl font-bold text-foreground">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a password reset link to <strong className="text-foreground">{email}</strong>.
              Click the link in the email to reset your password.
            </p>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link href="/">
            <KiddieBookLogo className="text-3xl" />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-foreground">Forgot your password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            <Mail className="mr-2 h-4 w-4" />
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
