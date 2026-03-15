import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { WishlistContent } from "@/components/kiddieboo/wishlist-content"

export const metadata = {
  title: "Wishlist - KiddieBoo",
  description: "Your saved favorite items",
}

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  )
}
