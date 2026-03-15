import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"

export const metadata = {
  title: "Refund Policy - KiddieBoo",
}

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-foreground">Refund Policy</h1>
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Return Window</h2>
              <p>
                Items may be returned within 30 days of delivery for a full refund. Items must be unworn, unwashed,
                and in their original condition with tags attached.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">How to Return</h2>
              <p>
                Contact us at hello@kiddieboo.com with your order number and reason for return. We will provide
                a prepaid return label for domestic orders.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Refund Processing</h2>
              <p>
                Once we receive your return, refunds are processed within 5-10 business days to the original
                payment method.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
