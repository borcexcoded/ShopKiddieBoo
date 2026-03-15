import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - KiddieBoo",
  description: "Manage your KiddieBoo store",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
