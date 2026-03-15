import Link from "next/link"
import { KiddieBookLogo } from "./logo"

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Dresses", href: "/shop?category=Dresses" },
    { label: "Tops", href: "/shop?category=Tops" },
    { label: "Bottoms", href: "/shop?category=Bottoms" },
    { label: "Sets", href: "/shop?category=Sets" },
  ],
  Help: [
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <KiddieBookLogo className="text-xl" />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Adorable, comfortable clothing for your little ones. Made with love and the softest materials.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-bold text-foreground">{title}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KiddieBoo. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
