"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ProductCard, ProductGridProvider, type Product } from "./product-grid"

export function ShopContent({
  products,
  categories,
}: {
  products: Product[]
  categories: string[]
}) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest")

  const filtered = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || p.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.sale_price ?? a.price) - (b.sale_price ?? b.price)
      if (sortBy === "price-high") return (b.sale_price ?? b.price) - (a.sale_price ?? a.price)
      return 0
    })

  return (
    <ProductGridProvider>
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">Shop All</h1>
        <p className="mt-1 text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Sticky Filters — top-[57px] accounts for the sticky header height */}
      <div className="sticky top-[57px] z-20 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        {/* Row 1: search + sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card rounded-full"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="shrink-0 rounded-full border border-input bg-card px-4 py-2 text-sm text-foreground transition-colors duration-200"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Row 2: categories — horizontal scroll on mobile, wrap on desktop */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full transition-all duration-200"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full transition-all duration-200"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground animate-fade-in-up">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-stagger">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
    </ProductGridProvider>
  )
}
