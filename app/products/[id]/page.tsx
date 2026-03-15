"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ChevronLeft, Minus, Plus, ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { ProductDetailSkeleton } from "@/components/shimmer-skeleton"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  sale_price: number | null
  category: string
  image_url: string | null
  sizes: string[]
  colors: string[]
  size_inventory: Record<string, number> | null
  in_stock: boolean
  featured: boolean
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const [{ data }, { data: wishlistItem }] = await Promise.all([
        supabase.from("products").select("*").eq("id", params.id).single(),
        user
          ? supabase.from("wishlist").select("id").eq("user_id", user.id).eq("product_id", params.id as string).maybeSingle()
          : Promise.resolve({ data: null }),
      ])

      if (data) {
        setProduct(data)
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
        if (data.colors?.length > 0) setSelectedColor(data.colors[0])
      }
      if (wishlistItem) setInWishlist(true)
      setLoading(false)
    }
    fetchData()
  }, [params.id, supabase])

  async function doAddToCart(): Promise<boolean> {
    if (!user) {
      toast.error("Please sign in to continue")
      router.push(`/auth/login?redirect=/products/${params.id}`)
      return false
    }
    if (!selectedSize && product!.sizes?.length > 0) {
      toast.error("Please select a size")
      return false
    }
    const { error } = await supabase.from("cart").insert({
      user_id: user.id,
      product_id: product!.id,
      quantity,
      size: selectedSize,
      price: product!.sale_price ?? product!.price,
    })
    if (error) {
      toast.error("Failed to add to cart")
      return false
    }
    return true
  }

  async function handleAddToCart() {
    setAddingToCart(true)
    const ok = await doAddToCart()
    if (ok) toast.success("Added to cart!")
    setAddingToCart(false)
  }

  async function handleBuyNow() {
    if (!user) {
      toast.error("Please sign in to continue")
      router.push(`/auth/login?redirect=/products/${params.id}`)
      return
    }
    if (!selectedSize && product!.sizes?.length > 0) {
      toast.error("Please select a size")
      return
    }
    setBuyingNow(true)
    const ok = await doAddToCart()
    setBuyingNow(false)
    if (ok) router.push("/checkout")
  }

  async function handleWishlist() {
    if (!user) {
      toast.error("Please sign in to use your wishlist")
      router.push(`/auth/login?redirect=/products/${params.id}`)
      return
    }
    setAddingToWishlist(true)
    if (inWishlist) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product!.id)
      setInWishlist(false)
      toast.success("Removed from wishlist")
    } else {
      const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: product!.id })
      if (!error) { setInWishlist(true); toast.success("Added to wishlist!") }
      else if (error.code === "23505") { setInWishlist(true); toast.error("Already in wishlist") }
      else toast.error("Failed to update wishlist")
    }
    setAddingToWishlist(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const hasSale = product.sale_price !== null && product.sale_price < product.price
  const discount = hasSale ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0
  const sizeInventory = product.size_inventory as Record<string, number> | null
  const selectedSizeInventory = selectedSize && sizeInventory ? sizeInventory[selectedSize] : null
  const isSizeOutOfStock = !!(selectedSize && selectedSizeInventory !== null && selectedSizeInventory <= 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              {hasSale && (
                <Badge className="absolute left-4 top-4 bg-orange-500 text-white font-bold">
                  -{discount}% OFF
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
              <h1 className="mt-1 text-3xl font-extrabold text-foreground">{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                {hasSale ? (
                  <>
                    <span className="text-3xl font-extrabold text-primary">
                      ₵{product.sale_price!.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ₵{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-foreground">
                    ₵{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                {product.description || "No description available."}
              </p>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-foreground">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const inventory = sizeInventory?.[size] ?? null
                      const isOutOfStock = inventory !== null && inventory <= 0
                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && setSelectedSize(size)}
                          disabled={isOutOfStock}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            isOutOfStock
                              ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                              : selectedSize === size
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {size}
                          {inventory !== null && <span className="ml-1 text-xs">({inventory})</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-foreground">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-foreground">Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || addingToCart || buyingNow}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={addingToCart || buyingNow}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!product.in_stock || addingToCart || buyingNow || isSizeOutOfStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {addingToCart ? "Adding..." : isSizeOutOfStock ? "Out of Stock" : product.in_stock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={inWishlist ? "border-black bg-black text-white hover:bg-black/90" : ""}
                    disabled={addingToWishlist}
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`h-5 w-5 ${inWishlist ? "fill-white" : ""}`} />
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  disabled={!product.in_stock || buyingNow || addingToCart || isSizeOutOfStock}
                  onClick={handleBuyNow}
                >
                  {buyingNow ? "Processing..." : "Buy Now"}
                </Button>
              </div>

              {/* Features */}
              <div className="mt-8 grid gap-4 rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Free shipping on orders over ₵250</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">100% secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
