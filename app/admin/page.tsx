import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/kiddieboo/admin/dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const [
    { data: products },
    { data: orders },
    { data: messages },
    { data: users },
    { count: productCount },
    { count: orderCount },
    { count: messageCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, email, full_name, is_admin, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ])

  return (
    <AdminDashboard
      products={products ?? []}
      orders={orders ?? []}
      messages={messages ?? []}
      users={users ?? []}
      currentUserEmail={currentUser?.email}
      stats={{
        totalProducts: productCount ?? 0,
        totalOrders: orderCount ?? 0,
        unreadMessages: messageCount ?? 0,
        totalUsers: userCount ?? 0,
      }}
    />
  )
}
