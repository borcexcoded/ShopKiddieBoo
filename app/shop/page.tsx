import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { ShopContent } from "@/components/kiddieboo/shop-content"
import { ProductGridSkeleton } from "@/components/shimmer-skeleton"

export const metadata = {
  title: "Shop - KiddieBoo",
  description: "Browse our full collection of adorable children's clothing",
}

async function ShopProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  const categories = Array.from(
    new Set((products ?? []).map((p: { category: string }) => p.category))
  )

  return <ShopContent products={products ?? []} categories={categories} />
}

export default async function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopProducts />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
