// This component only renders on Vercel deployments.
// It is intentionally a separate file so local dev never imports @vercel/analytics.
export function AnalyticsWrapper() {
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) return null
  // Dynamic import at render time so the module is never evaluated locally
  const Analytics = require("@vercel/analytics/next").Analytics
  return <Analytics />
}
