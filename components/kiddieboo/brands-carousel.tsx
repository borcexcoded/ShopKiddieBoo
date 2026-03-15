"use client"

export function BrandsCarousel() {
  const brands = [
    {
      name: "Nike",
      svg: (
        <svg viewBox="0 0 120 45" className="h-7 w-auto" fill="currentColor" aria-label="Nike">
          <path d="M12 35 L100 8 Q108 5 105 12 Q102 18 75 22 Z" />
        </svg>
      ),
    },
    {
      name: "Adidas",
      svg: (
        <svg viewBox="0 0 120 50" className="h-7 w-auto" fill="currentColor" aria-label="Adidas">
          <polygon points="60,5 30,45 90,45" opacity="0.9" />
          <rect x="20" y="38" width="80" height="5" />
        </svg>
      ),
    },
    {
      name: "H&M",
      svg: (
        <svg viewBox="0 0 80 40" className="h-6 w-auto" fill="currentColor" aria-label="H&M">
          <text x="0" y="32" fontSize="32" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-1">H&M</text>
        </svg>
      ),
    },
    {
      name: "Zara",
      svg: (
        <svg viewBox="0 0 80 30" className="h-5 w-auto" fill="currentColor" aria-label="Zara">
          <text x="0" y="24" fontSize="24" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="4">ZARA</text>
        </svg>
      ),
    },
    {
      name: "Gap",
      svg: (
        <svg viewBox="0 0 72 40" className="h-7 w-auto" aria-label="Gap">
          <rect width="72" height="40" rx="4" fill="#1c3f95" />
          <text x="50%" y="29" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="white" textAnchor="middle">GAP</text>
        </svg>
      ),
    },
    {
      name: "Target",
      svg: (
        <svg viewBox="0 0 40 40" className="h-8 w-auto" aria-label="Target">
          <circle cx="20" cy="20" r="19" fill="#cc0000" />
          <circle cx="20" cy="20" r="13" fill="white" />
          <circle cx="20" cy="20" r="7" fill="#cc0000" />
        </svg>
      ),
    },
    {
      name: "Puma",
      svg: (
        <svg viewBox="0 0 100 30" className="h-5 w-auto" fill="currentColor" aria-label="Puma">
          <text x="0" y="24" fontSize="24" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="3">PUMA</text>
        </svg>
      ),
    },
    {
      name: "Old Navy",
      svg: (
        <svg viewBox="0 0 120 30" className="h-5 w-auto" fill="currentColor" aria-label="Old Navy">
          <text x="0" y="24" fontSize="20" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="1">OLD NAVY</text>
        </svg>
      ),
    },
    {
      name: "Carter's",
      svg: (
        <svg viewBox="0 0 100 30" className="h-5 w-auto" fill="currentColor" aria-label="Carter's">
          <text x="0" y="24" fontSize="20" fontWeight="700" fontFamily="Georgia, serif">Carter's</text>
        </svg>
      ),
    },
  ]

  return (
    <section className="overflow-hidden border-y border-border bg-white py-10">
      <div className="mx-auto max-w-screen-xl px-4">
        <p className="mb-7 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted Alongside Top Brands
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="flex animate-[scroll_30s_linear_infinite] gap-14 px-8">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-700"
            >
              {brand.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
