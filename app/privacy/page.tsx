import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"

export const metadata = {
  title: "Privacy Policy - KiddieBoo",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
          <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase,
                contact us, or sign up for our newsletter. This may include your name, email address, shipping address,
                and payment information.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">How We Use Your Information</h2>
              <p>
                We use the information we collect to process transactions, send order confirmations, improve our services,
                and communicate with you about products, services, and promotions.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. However, no
                electronic transmission or storage method is 100% secure.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-foreground">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at hello@kiddieboo.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
