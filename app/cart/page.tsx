"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react"

type CartItem = {
  id: string
  product_id: string
  quantity: number
  size: string
  price: number
  product?: {
    id: string
    name: string
    image_url: string | null
    price: number
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchCart() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("cart")
        .select(`
          id,
          product_id,
          quantity,
          size,
          price,
          product:products(id, name, image_url, price)
        `)
        .eq("user_id", user.id)

      setCartItems((data as any) || [])
      setLoading(false)
    }
    fetchCart()
  }, [supabase])

  async function updateQuantity(id: string, newQuantity: number) {
    if (newQuantity < 1) return

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", id)

    if (!error) {
      setCartItems((items) =>
        items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  async function removeItem(id: string) {
    const { error } = await supabase.from("cart").delete().eq("id", id)

    if (!error) {
      setCartItems((items) => items.filter((item) => item.id !== id))
      toast.success("Item removed from cart")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Sign in to view your cart</h1>
          <p className="text-muted-foreground">Please sign in to add items and checkout</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
          <h1 className="mb-8 text-3xl font-extrabold text-foreground">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">Start shopping to add items to your cart</p>
              <Button asChild>
                <Link href="/shop">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/products/${item.product_id}`}
                              className="font-semibold text-foreground hover:underline"
                            >
                              {item.product?.name || "Product"}
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground">Size: {item.size}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-bold text-foreground">
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-foreground">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : `₵${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal < 50 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₵{(50 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-extrabold">₵{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6 w-full" size="lg" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
