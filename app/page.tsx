import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { Hero } from "@/components/kiddieboo/hero"
import { ProductGrid } from "@/components/kiddieboo/product-grid"
import { BrandsCarousel } from "@/components/kiddieboo/brands-carousel"
import { Testimonials } from "@/components/kiddieboo/testimonials"
import { ProductGridSkeleton } from "@/components/shimmer-skeleton"

async function FeaturedSection() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("in_stock", true)
    .limit(8)

  return (
    <ProductGrid
      id="featured-picks"
      products={featuredProducts ?? []}
      title="Featured Picks"
      subtitle="Our most loved styles, handpicked for your little ones"
    />
  )
}

async function TestimonialsSection() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  return <Testimonials testimonials={testimonials ?? []} />
}

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedSection />
        </Suspense>
        <BrandsCarousel />
        <Suspense fallback={<div className="py-16" />}>
          <TestimonialsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
