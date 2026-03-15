import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { Toaster } from 'sonner'
import { AnalyticsWrapper } from '@/components/kiddieboo/analytics-wrapper'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'KiddieBoo - Adorable Children\'s Clothing',
  description: 'Shop the cutest and most comfortable clothing for your little ones. Colorful, playful, and made with love.',
}

export const viewport: Viewport = {
  themeColor: '#fde8df',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased min-h-screen overflow-y-auto">
        {children}
        <Toaster
          position="top-center"
          richColors
          expand={false}
          duration={4000}
          toastOptions={{
            classNames: {
              toast: "font-sans rounded-xl shadow-lg border border-border",
              title: "font-bold",
              description: "text-sm opacity-80",
              success: "bg-card text-foreground border-green-200",
              error: "bg-card text-foreground border-red-200",
              info: "bg-card text-foreground",
              warning: "bg-card text-foreground border-amber-200",
            },
          }}
        />
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
