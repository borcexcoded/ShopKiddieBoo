import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"

export const metadata = { title: "Shipping Info - KiddieBoo" }

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-foreground">Shipping Information</h1>
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Free Shipping</h2>
              <p>Orders over $50 qualify for free standard shipping within Nigeria.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Delivery Times</h2>
              <p>Standard delivery: 3-5 business days. Express delivery: 1-2 business days (additional charges apply).</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Order Tracking</h2>
              <p>Once your order ships, you will receive a tracking number via email. You can also track your order on our Track Order page.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
