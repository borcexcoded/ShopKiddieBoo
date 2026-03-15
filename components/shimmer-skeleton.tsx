export function ProductGridSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center">
        <div className="h-8 w-48 shimmer"></div>
        <div className="mt-3 h-4 w-72 shimmer"></div>
      </div>
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="aspect-square shimmer"></div>
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 shimmer"></div>
              <div className="h-4 w-full shimmer"></div>
              <div className="h-5 w-20 shimmer"></div>
              <div className="h-9 w-full shimmer rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-fade-in-up">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square shimmer rounded-2xl"></div>
        <div className="space-y-5 py-4">
          <div className="h-4 w-20 shimmer"></div>
          <div className="h-9 w-3/4 shimmer"></div>
          <div className="h-8 w-32 shimmer"></div>
          <div className="space-y-2">
            <div className="h-4 w-full shimmer"></div>
            <div className="h-4 w-5/6 shimmer"></div>
            <div className="h-4 w-4/6 shimmer"></div>
          </div>
          <div className="flex gap-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-16 shimmer rounded-xl"></div>
            ))}
          </div>
          <div className="h-12 w-full shimmer rounded-full mt-4"></div>
          <div className="h-12 w-full shimmer rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export function CartPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 animate-fade-in-up">
      <div className="h-8 w-48 shimmer mb-8"></div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            >
              <div className="h-24 w-24 shrink-0 shimmer rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 shimmer"></div>
                <div className="h-4 w-20 shimmer"></div>
                <div className="h-4 w-24 shimmer"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] space-y-4 h-fit">
          <div className="h-6 w-36 shimmer"></div>
          <div className="h-4 w-full shimmer"></div>
          <div className="h-4 w-full shimmer"></div>
          <div className="h-px bg-border my-2"></div>
          <div className="h-6 w-full shimmer"></div>
          <div className="h-12 w-full shimmer rounded-full mt-4"></div>
        </div>
      </div>
    </div>
  )
}
