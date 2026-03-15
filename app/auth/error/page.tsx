import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KiddieBookLogo } from "@/components/kiddieboo/logo"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/">
          <KiddieBookLogo className="text-3xl" />
        </Link>
        
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-xl font-bold text-foreground">Authentication Error</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong during sign in. Please try again.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Back to store</Link>
        </p>
      </div>
    </div>
  )
}
