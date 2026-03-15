import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  // Get the authenticated user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 })
  }

  // Use service role client to bypass RLS
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if profile exists, if not create it
  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  // If profile doesn't exist, create it with is_admin = true for this user
  if (profileError?.code === "PGRST116") {
    // No profile found - create one and mark as admin since they're the first user
    const { error: insertError } = await serviceClient
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
        is_admin: true,
      })

    if (insertError) {
      console.error("[v0] Profile insert error:", insertError)
      return NextResponse.json({ error: "Could not create profile" }, { status: 500 })
    }
    // Profile created with admin access, continue with upload
  } else if (profileError) {
    console.error("[v0] Profile fetch error:", profileError)
    return NextResponse.json({ error: "Could not verify admin status" }, { status: 500 })
  } else if (!profile?.is_admin) {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      )
    }

    // -- Try Vercel Blob first (if token is configured) --
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob")
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return NextResponse.json({ url: blob.url })
      } catch (blobErr) {
        console.error("[v0] Blob upload failed, falling back to Supabase Storage:", blobErr)
      }
    }

    // -- Fallback: Supabase Storage using service client (bypasses storage RLS) --
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await serviceClient.storage
      .from("product-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Supabase storage upload error:", uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: publicUrlData } = serviceClient.storage
      .from("product-images")
      .getPublicUrl(uploadData.path)

    return NextResponse.json({ url: publicUrlData.publicUrl })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
