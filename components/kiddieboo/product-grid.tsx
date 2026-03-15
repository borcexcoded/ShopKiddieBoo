"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { toast } from "sonner"

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  sale_price: number | null
  category: string
  image_url: string | null
  sizes: string[]
  colors: string[]
  in_stock: boolean
  featured: boolean
}

// Shared context for user, wishlist, and cart data to avoid multiple auth calls
type ProductGridContextType = {
  userId: string | null
  wishlistIds: Set<string>
  setWishlistIds: React.Dispatch<React.SetStateAction<Set<string>>>
  cartIds: Set<string>
  setCartIds: React.Dispatch<React.SetStateAction<Set<string>>>
  currency: { code: string; locale: string }
}

const ProductGridContext = createContext<ProductGridContextType | null>(null)

function useProductGridContext() {
  const ctx = useContext(ProductGridContext)
  if (!ctx) {
    // Fallback for standalone ProductCard usage
    return {
      userId: null,
      wishlistIds: new Set<string>(),
      setWishlistIds: () => {},
      cartIds: new Set<string>(),
      setCartIds: () => {},
      currency: { code: "USD", locale: "en-US" },
    }
  }
  return ctx
}

export function ProductCard({ product }: { product: Product }) {
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const { userId, wishlistIds, setWishlistIds, cartIds, setCartIds, currency } = useProductGridContext()
  const inWishlist = wishlistIds.has(product.id)
  const inCart = cartIds.has(product.id)
  const router = useRouter()
  const supabase = createClient()

  const hasSale = product.sale_price !== null && product.sale_price < product.price
  const discount = hasSale
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  function formatPrice(amount: number) {
    // Always use GHS (Ghana Cedis) regardless of detected locale
    const formatted = new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 2,
    }).format(amount)
    // Normalize to just ₵ symbol
    return formatted.replace(/GH₵|GHS|₵₵|\$/g, '₵').replace(/£/g, '₵')
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      toast.error("Please sign in to add to cart")
      router.push(`/auth/login?redirect=/shop`)
      return
    }

    if (!product.in_stock) {
      toast.error("This item is out of stock")
      return
    }

    if (inCart) {
      toast("Already in your cart", { description: "Visit your cart to manage quantities." })
      return
    }

    const defaultSize = product.sizes?.[0] || null
    if (!defaultSize && product.sizes?.length > 0) {
      toast.error("Please select a size first")
      router.push(`/products/${product.id}`)
      return
    }

    setAddingToCart(true)
    const { error } = await supabase.from("cart").insert({
      user_id: userId,
      product_id: product.id,
      quantity: 1,
      size: defaultSize,
      price: product.sale_price ?? product.price,
    })

    setAddingToCart(false)
    if (error) {
      toast.error("Failed to add to cart")
    } else {
      setCartIds((prev) => new Set(prev).add(product.id))
      toast.success("Added to cart!")
    }
  }

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      toast.error("Please sign in to use wishlist")
      router.push(`/auth/login?redirect=/shop`)
      return
    }

    setAddingToWishlist(true)

    if (inWishlist) {
      // Remove from wishlist
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", product.id)

      setAddingToWishlist(false)
      if (!error) {
        setWishlistIds((prev) => {
          const next = new Set(prev)
          next.delete(product.id)
          return next
        })
        toast.success("Removed from wishlist")
      } else {
        toast.error("Failed to remove from wishlist")
      }
    } else {
      // Add to wishlist
      const { error } = await supabase.from("wishlist").insert({
        user_id: userId,
        product_id: product.id,
      })

      setAddingToWishlist(false)
      if (error) {
        if (error.code === "23505") {
          setWishlistIds((prev) => new Set(prev).add(product.id))
          toast.error("Already in wishlist")
        } else {
          toast.error("Failed to add to wishlist")
        }
      } else {
        setWishlistIds((prev) => new Set(prev).add(product.id))
        toast.success("Added to wishlist!")
      }
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-[#f5f5f7]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/50 text-sm">
            No image
          </div>
        )}
        {hasSale && (
          <Badge className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            -{discount}%
          </Badge>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Badge variant="secondary" className="rounded-full text-sm font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">{product.category}</p>
          <h3 className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
        </Link>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          {hasSale ? (
            <>
              <span className="text-base font-bold text-foreground">
                {formatPrice(product.sale_price!)}
              </span>
              <span className="text-xs text-muted-foreground/60 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-muted-foreground/60">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="mt-3 flex gap-2 pointer-events-auto relative z-10"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Button
            size="sm"
            className={`flex-1 text-xs rounded-full transition-all duration-300 ${
              inCart
                ? "cursor-default opacity-50"
                : ""
            }`}
            disabled={!product.in_stock || addingToCart}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddToCart(e)
            }}
            aria-label={inCart ? "Already in cart" : "Add to cart"}
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            {addingToCart ? "Adding..." : inCart ? "In Cart" : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`aspect-square rounded-full p-0 transition-all duration-300 ${
              inWishlist
                ? "border-orange-500 bg-orange-500 text-white"
                : "hover:border-orange-500 hover:bg-orange-500 hover:text-white"
            }`}
            disabled={addingToWishlist}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleWishlist(e)
            }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3 w-3 ${inWishlist ? "fill-white text-white" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductGridProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [cartIds, setCartIds] = useState<Set<string>>(new Set())
  const [currency, setCurrency] = useState<{ code: string; locale: string }>({
    code: "GHS",
    locale: "en-GH",
  })

  // Listen to auth state changes so userId is always in sync
  useEffect(() => {
    const supabase = createClient()

    async function loadForUser(uid: string | null) {
      // Detect locale/currency
      try {
        const locale = navigator.language || "en-US"
        const regionCurrencyMap: Record<string, string> = {
          ZA: "ZAR", GB: "GBP", EU: "EUR", NG: "NGN", GH: "GHS",
          KE: "KES", IN: "INR", AU: "AUD", CA: "CAD", JP: "JPY",
          CN: "CNY", BR: "BRL", MX: "MXN", AE: "AED",
        }
        const region = new Intl.Locale(locale).region ?? "US"
        const code = regionCurrencyMap[region] ?? "GHS"
        setCurrency({ code, locale })
      } catch {
        setCurrency({ code: "GHS", locale: "en-GH" })
      }

      setUserId(uid)

      if (!uid) {
        setWishlistIds(new Set())
        setCartIds(new Set())
        return
      }

      const [{ data: wishlist }, { data: cart }] = await Promise.all([
        supabase.from("wishlist").select("product_id").eq("user_id", uid),
        supabase.from("cart").select("product_id").eq("user_id", uid),
      ])

      if (wishlist) setWishlistIds(new Set(wishlist.map((w) => w.product_id)))
      if (cart) setCartIds(new Set(cart.map((c) => c.product_id)))
    }

    // Run once immediately with current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      loadForUser(user?.id ?? null)
    })

    // Subscribe to future auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadForUser(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <ProductGridContext.Provider value={{ userId, wishlistIds, setWishlistIds, cartIds, setCartIds, currency }}>
      {children}
    </ProductGridContext.Provider>
  )
}

export function ProductGrid({
  products,
  title,
  subtitle,
  id,
}: {
  products: Product[]
  title: string
  subtitle?: string
  id?: string
}) {
  return (
    <ProductGridProvider>
      <section id={id} className="mx-auto max-w-screen-xl px-4 py-16 scroll-mt-20 animate-fade-in-up">
        <div className="mb-8 text-center">
          <h2 className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-stagger">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
          >
            View All Products
          </Link>
        </div>
      </section>
    </ProductGridProvider>
  )
}
