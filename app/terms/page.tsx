import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"

export const metadata = {
  title: "Terms of Service - KiddieBoo",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-foreground">Terms of Service</h1>
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Acceptance of Terms</h2>
              <p>
                By accessing and using KiddieBoo, you agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our services.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Orders and Payments</h2>
              <p>
                All prices are displayed in USD. We reserve the right to modify prices at any time. Payment is required
                at the time of purchase. We accept major credit cards and other payment methods as indicated.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Shipping</h2>
              <p>
                We offer free shipping on orders over $50. Delivery times vary based on location. You will receive a
                tracking number once your order has shipped.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Returns and Refunds</h2>
              <p>
                We accept returns within 30 days of purchase for unworn items in original condition. Refunds will be
                processed to the original payment method within 5-10 business days.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
