"use client"

import { useEffect, useCallback, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Truck, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    src: "/images/hero-1.webp",
    alt: "Children in colorful casual wear with denim and plaid styles",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Happy kids laughing in rainbow dresses and denim overalls",
  },
]

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  return (
    <section className="relative overflow-hidden bg-[#fde8df]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-4 py-16 md:flex-row md:py-20">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left animate-fade-in-up">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-4 py-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4" />
            New Spring Collection
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Dress Your Little Ones in Joy
          </h1>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground md:text-lg">
            Colorful, comfortable, and irresistibly cute clothing for kids who love to play, explore, and dream big.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" className="rounded-full px-8 transition-all duration-300 hover:shadow-lg" asChild>
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white px-8 transition-all duration-300 hover:shadow-lg" asChild>
              <Link href="#featured-picks">Featured Picks</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders over ₵250</span>
          </div>
        </div>

        {/* Hero carousel */}
        <div className="relative flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative w-full min-h-80 aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            {/* Embla viewport */}
            <div className="overflow-hidden h-full w-full rounded-2xl" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, i) => (
                  <div
                    key={i}
                    className="relative min-w-0 flex-[0_0_100%] h-full"
                    style={{ minHeight: "320px" }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      onError={(e) => {
                        // Fallback to hero-banner if slide image not found
                        const target = e.currentTarget as HTMLImageElement
                        if (target.src !== window.location.origin + "/images/hero-banner.jpg") {
                          target.src = "/images/hero-banner.jpg"
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? "w-5 bg-white" : "w-2 bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-3 -left-3 hidden rounded-xl bg-card p-4 shadow-lg md:block md:-bottom-4 md:-left-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-foreground">1000+</p>
              <p className="text-xs font-medium text-muted-foreground">Happy Families</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
