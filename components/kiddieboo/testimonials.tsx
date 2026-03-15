"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export type Testimonial = {
  id: string
  name: string
  image_url: string | null
  rating: number
  review: string
  product_name: string | null
}

// Fallback portrait images — local avatars
const fallbackAvatars = [
  "/images/avatar-1.jpg",
  "/images/avatar-2.jpg",
  "/images/avatar-3.jpg",
  "/images/avatar-4.jpg",
  "/images/avatar-5.jpg",
  "/images/avatar-6.jpg",
]

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const testimonial = testimonials[current]
  const fallbackAvatar = fallbackAvatars[current % fallbackAvatars.length]
  const avatarSrc = testimonial.image_url || fallbackAvatar

  const goToPrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const goToNext = () => setCurrent((prev) => (prev + 1) % testimonials.length)

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="mx-auto max-w-4xl px-4 animate-fade-in-up">
        <div className="mb-8 text-center">
          <h2 className="text-balance text-2xl font-extrabold text-foreground md:text-3xl">
            What Parents Say
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real reviews from real families who love KiddieBoo
          </p>
        </div>

        <div className="relative rounded-xl bg-white p-6 shadow-md">
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:gap-6">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-md">
              <img
                src={avatarSrc}
                alt={testimonial.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (!target.src.endsWith(fallbackAvatar)) {
                    target.src = fallbackAvatar
                  }
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Stars */}
              <div className="mb-2 flex justify-center gap-0.5 md:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-3 text-sm leading-relaxed text-foreground md:text-base">
                "{testimonial.review}"
              </p>

              {/* Author */}
              <div>
                <p className="text-sm font-bold text-foreground">
                  - {testimonial.name}
                </p>
                {testimonial.product_name && (
                  <p className="text-xs text-muted-foreground">
                    Purchased: {testimonial.product_name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={goToPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === current
                      ? "w-5 bg-foreground"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
