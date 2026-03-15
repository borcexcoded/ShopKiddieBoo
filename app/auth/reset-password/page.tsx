"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KiddieBookLogo } from "@/components/kiddieboo/logo"
import { toast } from "sonner"
import { Lock, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase handles the token exchange automatically via the URL hash
    // We just need to verify the user session exists after the redirect
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true)
      }
    })
    // Also check if user is already in a password recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      }
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      toast.error("Failed to reset password", { description: error.message })
    } else {
      toast.success("Password updated!", { description: "You can now sign in with your new password." })
      router.push("/auth/login")
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center animate-fade-in-up">
          <div className="mb-6">
            <Link href="/">
              <KiddieBookLogo className="text-3xl" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Verifying your reset link...</p>
          </div>
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
          <h1 className="mt-4 text-xl font-bold text-foreground">Set new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Confirm your password"
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            <Lock className="mr-2 h-4 w-4" />
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
