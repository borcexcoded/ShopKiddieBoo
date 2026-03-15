"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Truck, CheckCircle2, Clock, Search, MapPin } from "lucide-react"
import { toast } from "sonner"

type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  status: string
  items: { name: string; size: string; qty: number; price: number }[]
  total: number
  shipping_address: { street: string; city: string; state: string; zip: string } | null
  tracking_number: string | null
  created_at: string
  updated_at: string
}

const statusSteps = [
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
]

function getStatusIndex(status: string) {
  const idx = statusSteps.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

export function OrderTracker() {
  const [query, setQuery] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`order_number.eq.${query.trim()},tracking_number.eq.${query.trim()}`)
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      setOrder(null)
      toast.error("Order not found. Please check your order number or tracking number.")
    } else {
      setOrder(data as Order)
    }
    setLoading(false)
  }

  const statusIdx = order ? getStatusIndex(order.status) : 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Track Your Order</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your order number or tracking number
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="e.g. KB-2024-001 or TRK-KB-123456"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {searched && !order && !loading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium text-foreground">No order found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try the demo order: KB-2024-001
          </p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Status timeline */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-foreground">Order {order.order_number}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => {
                const isActive = i <= statusIdx
                const StepIcon = step.icon
                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center">
                    <div className="relative flex items-center">
                      {i > 0 && (
                        <div
                          className={`absolute right-1/2 h-0.5 w-[calc(100%+3rem)] -translate-x-1/2 ${
                            i <= statusIdx ? "bg-primary" : "bg-border"
                          }`}
                          style={{ zIndex: 0 }}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>

            {order.tracking_number && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tracking:</span>
                <span className="font-mono font-semibold text-foreground">{order.tracking_number}</span>
              </div>
            )}
          </div>

          {/* Order details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-foreground">Order Details</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} &middot; Qty: {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">₵{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-3 text-right">
              <span className="text-sm text-muted-foreground">Total: </span>
              <span className="text-lg font-extrabold text-foreground">₵{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold text-foreground">Shipping Address</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {order.shipping_address.street}<br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
