import Link from "next/link"
import { KiddieBookLogo } from "@/components/kiddieboo/logo"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/">
          <KiddieBookLogo className="text-3xl" />
        </Link>
        <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">Check Your Email</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {"We've sent you a confirmation email. Click the link in the email to activate your account."}
        </p>
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  )
}
