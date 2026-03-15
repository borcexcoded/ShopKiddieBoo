"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Heart, Package, ShieldCheck, ShoppingCart, LogOut } from "lucide-react"
import { KiddieBookLogo } from "./logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/track-order", label: "Track Order", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Check admin status: hardcoded fallback + profiles table
        const ADMIN_EMAIL = "odedasiedu1@gmail.com"
        if (user.email === ADMIN_EMAIL) {
          // Fetch cart count while we know admin status
          const { count } = await supabase
            .from("cart")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
          setIsAdmin(true)
          setCartCount(count ?? 0)
        } else {
          // Parallelize profile + cart queries
          const [{ data: profile }, { count }] = await Promise.all([
            supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
            supabase.from("cart").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          ])
          setIsAdmin(profile?.is_admin ?? false)
          setCartCount(count ?? 0)
        }
      } else {
        setIsAdmin(false)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setCartCount(0)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-border/50 transition-all duration-300">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <KiddieBookLogo className="text-2xl" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              {isAdmin && (
                <Button size="sm" asChild>
                  <Link href="/admin">
                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/cart" onClick={() => setMobileOpen(false)}>
                      <ShoppingCart className="mr-1.5 h-4 w-4" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button size="sm" asChild>
                      <Link href="/admin" onClick={() => setMobileOpen(false)}>
                        <ShieldCheck className="mr-1.5 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                    <LogOut className="mr-1.5 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
