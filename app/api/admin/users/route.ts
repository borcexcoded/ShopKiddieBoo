import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const SUPER_ADMIN_EMAIL = "odedasiedu1@gmail.com"

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

  // Hardcoded super admin fallback
  if (user.email === SUPER_ADMIN_EMAIL) return user

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!profile?.is_admin) return null
  return user
}

async function requireSuperAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (user.email !== SUPER_ADMIN_EMAIL) return null
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

  // Prevent deleting the super admin
  const admin = getAdminClient()
  const { data: targetUser } = await admin.auth.admin.getUserById(userId)
  if (targetUser?.user?.email === SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Cannot delete the super admin account" }, { status: 403 })
  }

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

  const { email, makeAdmin } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 })
  }

  // Only super admin can invite as admin
  if (makeAdmin && caller.email !== SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Only the super admin can invite new admins" }, { status: 403 })
  }

  const admin = getAdminClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000"

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If invited as admin, set is_admin in profiles
  if (makeAdmin && data.user) {
    await admin.from("profiles").upsert({
      id: data.user.id,
      email,
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  return NextResponse.json({ success: true, user: data.user })
}

// PATCH /api/admin/users — toggle admin status (super admin only)
export async function PATCH(request: Request) {
  const caller = await requireSuperAdmin()
  if (!caller) {
    return NextResponse.json({ error: "Only the super admin can change admin roles" }, { status: 403 })
  }

  const { userId, is_admin } = await request.json()
  if (!userId || typeof is_admin !== "boolean") {
    return NextResponse.json({ error: "userId and is_admin required" }, { status: 400 })
  }

  // Prevent revoking super admin's own admin status
  const admin = getAdminClient()
  const { data: targetUser } = await admin.auth.admin.getUserById(userId)
  if (targetUser?.user?.email === SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Cannot modify the super admin's role" }, { status: 403 })
  }

  const { error } = await admin.from("profiles").update({ is_admin, updated_at: new Date().toISOString() }).eq("id", userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
