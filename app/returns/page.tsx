import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"

export const metadata = { title: "Returns - KiddieBoo" }

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-foreground">Returns</h1>
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>We want you to be completely happy with your purchase. If something is not right, we are here to help.</p>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Eligible Returns</h2>
              <p>Items must be returned within 30 days, unworn, with original tags. Sale items are final sale.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Process</h2>
              <p>Email hello@kiddieboo.com with your order number. We will send a return label within 24 hours.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
