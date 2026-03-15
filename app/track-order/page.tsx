import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { OrderTracker } from "@/components/kiddieboo/order-tracker"

export const metadata = {
  title: "Track Order - KiddieBoo",
  description: "Track your KiddieBoo order status and delivery",
}

export default function TrackOrderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <OrderTracker />
      </main>
      <Footer />
    </div>
  )
}
