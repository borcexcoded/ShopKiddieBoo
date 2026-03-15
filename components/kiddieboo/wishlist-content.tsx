"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Trash2, LogIn, ShoppingCart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type WishlistItem = {
  id: string
  product_id: string
  products: {
    id: string
    name: string
    price: number
    sale_price: number | null
    image_url: string | null
    category: string
    sizes: string[]
    in_stock: boolean
  }
}

export function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoggedIn(false)
        setLoading(false)
        return
      }

      setUserId(user.id)
      setIsLoggedIn(true)
      const { data } = await supabase
        .from("wishlist")
        .select("id, product_id, products(id, name, price, sale_price, image_url, category, sizes, in_stock)")
        .eq("user_id", user.id)

      setItems((data as unknown as WishlistItem[]) ?? [])
      setLoading(false)
    }
    load()
  }, [supabase])

  async function removeItem(wishlistId: string) {
    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId)
    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== wishlistId))
      toast.success("Removed from wishlist")
    }
  }

  async function addToCart(item: WishlistItem) {
    if (!userId) return
    if (!item.products.in_stock) {
      toast.error("This item is out of stock")
      return
    }

    const defaultSize = item.products.sizes?.[0] || null

    setAddingToCart((prev) => ({ ...prev, [item.id]: true }))
    const { error } = await supabase.from("cart").insert({
      user_id: userId,
      product_id: item.product_id,
      quantity: 1,
      size: defaultSize,
      price: item.products.sale_price ?? item.products.price,
    })

    setAddingToCart((prev) => ({ ...prev, [item.id]: false }))
    if (error) {
      toast.error("Failed to add to cart")
    } else {
      toast.success("Added to cart!")
    }
  }

  async function addAllToCart() {
    if (!userId) return
    const inStockItems = items.filter((item) => item.products.in_stock)
    if (inStockItems.length === 0) {
      toast.error("No in-stock items to add")
      return
    }

    for (const item of inStockItems) {
      await addToCart(item)
    }
    router.push("/cart")
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view and manage your wishlist</p>
        <Button className="mt-6" asChild>
          <Link href="/auth/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-extrabold text-foreground">My Wishlist</h1>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Browse our shop to find items you love</p>
          <Button className="mt-4" asChild>
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Add All to Cart Button */}
          <div className="mb-4 flex justify-end">
            <Button onClick={addAllToCart} className="bg-orange-500 hover:bg-orange-600 text-white">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add All to Cart & Checkout
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <Link href={`/products/${item.product_id}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.products.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product_id}`}>
                    <p className="font-bold text-foreground truncate">{item.products.name}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.products.category}</p>
                  <p className="mt-1 font-semibold text-primary">
                    ₵{(item.products.sale_price ?? item.products.price).toFixed(2)}
                  </p>
                  {!item.products.in_stock && (
                    <p className="text-xs text-destructive">Out of Stock</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={!item.products.in_stock || addingToCart[item.id]}
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    {addingToCart[item.id] ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
