"use client"

import { useState } from "react"
import Link from "next/link"
import { KiddieBookLogo } from "../logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  ArrowLeft,
  LogOut,
  Box,
  Mail,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProductsTab } from "./products-tab"
import { OrdersTab } from "./orders-tab"
import { MessagesTab } from "./messages-tab"
import { UsersTab } from "./users-tab"

type Props = {
  products: any[]
  orders: any[]
  messages: any[]
  users: any[]
  stats: {
    totalProducts: number
    totalOrders: number
    unreadMessages: number
    totalUsers: number
  }
}

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "users", label: "Users", icon: Users },
  { key: "messages", label: "Messages", icon: MessageSquare },
] as const

type TabKey = (typeof tabs)[number]["key"]

export function AdminDashboard({ products, orders, messages, users, stats }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out")
    router.push("/")
    router.refresh()
  }

  const revenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0)

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 border-b border-border bg-card lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-4 lg:flex-col lg:items-start lg:gap-6 lg:p-5">
          <div className="flex items-center gap-3">
            <KiddieBookLogo className="text-xl" />
            <Badge variant="outline" className="text-xs">Admin</Badge>
          </div>

          {/* Mobile tab row — scrollable */}
          <div className="flex gap-1 overflow-x-auto lg:hidden [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative shrink-0 rounded-lg p-2 ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                aria-label={tab.label}
              >
                <tab.icon className="h-4 w-4" />
                {tab.key === "messages" && stats.unreadMessages > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop sidebar nav */}
          <nav className="hidden w-full flex-col gap-1 lg:flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.key === "messages" && stats.unreadMessages > 0 && (
                  <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          <div className="hidden gap-2 lg:flex lg:w-full lg:flex-col lg:mt-auto lg:pt-4 lg:border-t lg:border-border">
            <Button variant="ghost" size="sm" className="justify-start" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome to your KiddieBoo admin panel</p>

            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard icon={Box} label="Products" value={stats.totalProducts} />
              <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} />
              <StatCard icon={Users} label="Users" value={stats.totalUsers} />
              <StatCard icon={Mail} label="Unread" value={stats.unreadMessages} />
              <StatCard
                icon={Package}
                label="Revenue"
                value={`₵${revenue.toFixed(2)}`}
                className="col-span-2 sm:col-span-1"
              />
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-foreground">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Order</th>
                        <th className="hidden px-4 py-3 text-left font-semibold text-foreground sm:table-cell">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                        <th className="px-4 py-3 text-right font-semibold text-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order: any) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <p className="font-mono text-xs font-medium text-foreground">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{order.customer_name}</p>
                          </td>
                          <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{order.customer_name}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            ₵{Number(order.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "products" && <ProductsTab products={products} />}
        {activeTab === "orders" && <OrdersTab orders={orders} />}
        {activeTab === "users" && <UsersTab users={users} />}
        {activeTab === "messages" && <MessagesTab messages={messages} />}
      </main>

      {/* Mobile footer with shop + logout */}
      <footer className="sticky bottom-0 z-40 flex items-center justify-between border-t border-border bg-card px-4 py-3 lg:hidden">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Shop
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={handleLogout}>
          <LogOut className="mr-1.5 h-4 w-4" />
          Sign Out
        </Button>
      </footer>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: any
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-border bg-card p-4 lg:gap-4 lg:p-5 ${className ?? ""}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 lg:h-11 lg:w-11">
        <Icon className="h-4 w-4 text-primary lg:h-5 lg:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground lg:text-sm">{label}</p>
        <p className="truncate text-lg font-extrabold text-foreground lg:text-xl">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    processing: "bg-amber-100 text-amber-500",
    shipped: "bg-sky-100 text-sky-500",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-destructive/10 text-destructive",
  }
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
        colors[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  )
}
