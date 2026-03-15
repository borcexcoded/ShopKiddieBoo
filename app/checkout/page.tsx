"use client"

import { useCallback, useEffect, useState, use } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import Link from "next/link"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { startCheckoutFromCart } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    startCheckoutFromCart()
      .then((secret) => {
        if (!cancelled) {
          setClientSecret(secret)
          setLoading(false)
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err.message || "Failed to start checkout")
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const onComplete = useCallback(() => {
    setCompleted(true)
  }, [])

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Payment Successful!</h1>
          <p className="max-w-md text-center text-muted-foreground">
            Thank you for your order. You will receive an email confirmation shortly.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/track-order">Track Order</Link>
            </Button>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
          <h1 className="text-2xl font-bold text-foreground">Checkout Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild>
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Preparing checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Link>
            </Button>
          </div>
          <h1 className="mb-8 text-3xl font-extrabold text-foreground">Checkout</h1>
          <div className="rounded-xl border border-border bg-card p-6">
            {clientSecret && (
              <EmbeddedCheckoutProvider
                key={clientSecret}
                stripe={stripePromise}
                options={{ clientSecret, onComplete }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
