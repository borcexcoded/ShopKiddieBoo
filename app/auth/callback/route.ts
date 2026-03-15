import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // Support both "next" and "redirect" query params for flexibility
  const next = searchParams.get("next") ?? searchParams.get("redirect") ?? "/"
  // Sanitise: only allow relative paths to prevent open redirect
  const safePath = next.startsWith("/") ? next : "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Ensure profile exists (handles Google OAuth + any missed profiles)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const meta = user.user_metadata ?? {}
        const fullName = meta.full_name ?? meta.name ?? meta.first_name ?? null

        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
          },
          { onConflict: "id", ignoreDuplicates: false }
        )
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safePath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safePath}`)
      } else {
        return NextResponse.redirect(`${origin}${safePath}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
