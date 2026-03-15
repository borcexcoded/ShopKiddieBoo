import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { ContactForm } from "@/components/kiddieboo/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata = {
  title: "Contact Us - KiddieBoo",
  description: "Get in touch with the KiddieBoo team",
}

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@kiddieboo.com" },
  { icon: Phone, label: "Phone", value: "+234 (0) 800 KIDDIE" },
  { icon: MapPin, label: "Address", value: "Lagos, Nigeria" },
  { icon: Clock, label: "Hours", value: "Mon-Sat 9am - 6pm" },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
              Contact Us
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"We'd love to hear from you! Send us a message and we'll respond as soon as possible."}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-foreground">Get in Touch</h2>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{info.label}</p>
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 p-6">
                <h3 className="font-bold text-foreground">Quick Tips</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>For order issues, include your order number</li>
                  <li>For returns, check our return policy first</li>
                  <li>Response time is typically within 24 hours</li>
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
