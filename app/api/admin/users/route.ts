import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Admin Supabase client using service role — bypasses RLS
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!profile?.is_admin) return null
  return user
}

// DELETE /api/admin/users — delete a user account entirely
export async function DELETE(request: Request) {
  const caller = await requireAdmin()
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// POST /api/admin/users — invite a user by email
export async function POST(request: Request) {
  const caller = await requireAdmin()
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 })
  }

  const admin = getAdminClient()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase.co", "supabase.co")}/auth/v1/verify`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, user: data.user })
}
