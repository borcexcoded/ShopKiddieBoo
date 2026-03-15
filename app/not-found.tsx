import Link from "next/link"
import { Header } from "@/components/kiddieboo/header"
import { Footer } from "@/components/kiddieboo/footer"
import { Button } from "@/components/ui/button"
import { Home, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="text-8xl font-extrabold text-primary/20">404</div>
        <h1 className="text-3xl font-extrabold text-foreground">Page Not Found</h1>
        <p className="max-w-md text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Shop
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
