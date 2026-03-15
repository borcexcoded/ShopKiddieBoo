"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Copy, Edit2, X } from "lucide-react"

type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  status: string
  items: any[]
  total: number
  tracking_number: string | null
  created_at: string
}

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

export function OrdersTab({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({})

  async function updateStatus(orderId: string, newStatus: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) {
      toast.error("Failed to update order status")
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      toast.success(`Order updated to ${newStatus}`)
    }
  }

  async function updateTrackingNumber(orderId: string, trackingNumber: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("orders")
      .update({ tracking_number: trackingNumber || null })
      .eq("id", orderId)

    if (error) {
      toast.error("Failed to update tracking number")
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber || null } : o))
      )
      toast.success("Tracking number updated!")
      setEditingId(null)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="space-y-4 overflow-x-auto">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-mono text-sm font-bold text-foreground">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-foreground">₵{Number(order.total).toFixed(2)}</p>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <Label className="text-xs font-semibold text-muted-foreground">Tracking Number</Label>
              {editingId === order.id ? (
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Enter tracking number"
                    value={trackingInput[order.id] || order.tracking_number || ""}
                    onChange={(e) => setTrackingInput((p) => ({ ...p, [order.id]: e.target.value }))}
                  />
                  <Button
                    size="sm"
                    onClick={() => updateTrackingNumber(order.id, trackingInput[order.id] || "")}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-foreground">
                    {order.tracking_number || "Not set"}
                  </p>
                  <div className="flex gap-1">
                    {order.tracking_number && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(order.tracking_number!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(order.id)
                        setTrackingInput((p) => ({ ...p, [order.id]: order.tracking_number || "" }))
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-3 space-y-1">
              {order.items.map((item: any, i: number) => (
                <p key={i} className="text-xs text-muted-foreground">
                  {item.name} (Size: {item.size}) x{item.qty} - ₵{item.price.toFixed(2)}
                </p>
              ))}
            </div>

            {/* Status changer */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <span className="text-xs font-medium text-muted-foreground">Status:</span>
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={order.status === status ? "default" : "outline"}
                  size="sm"
                  className="text-xs capitalize"
                  onClick={() => updateStatus(order.id, status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
