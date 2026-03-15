# KiddieBoo - Final Local Setup Guide

All fixes have been applied. Follow these steps to run the app locally.

## ✅ What's Been Fixed

1. **Hero Image Carousel** - Auto-rotating carousel with prev/next controls using new images
   - Images: `/images/hero-1.webp` and `/images/hero-2.jpg`
   - Auto-advances every 4 seconds

2. **Wishlist Auth Bug** - Fixed to prevent "Not logged in" when user is logged in
   - Now uses `onAuthStateChange` listener for real-time auth state
   - Works immediately after login

3. **Image Upload Authorization** - Fixed admin upload not working
   - Uses service role key to bypass RLS and check admin status
   - Falls back to Supabase Storage (not Vercel Blob)
   - Storage bucket created with public read & authenticated write

4. **Currency** - All prices display in Ghana Cedis (₵)
   - Replaced $ and £ with ₵ throughout the app
   - Default currency: GHS (Ghana Cedis)

5. **Local Styling** - Fixed Tailwind & fonts for local development
   - Removed @vercel/analytics that was breaking locally
   - Nunito font properly connected to Tailwind
   - Conditional Analytics (only on Vercel deployment)

6. **Database Storage** - Configured for image uploads
   - Supabase Storage bucket: `product-images`
   - Public read access, authenticated write access
   - SQL script executed: `setup-storage-bucket.sql`

## 🚀 Local Setup Steps

### 1. Install Dependencies
```bash
npm install
```
or
```bash
pnpm install
```

### 2. Environment Variables
Copy `.env.local` template and fill in values:
```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin uploads)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (optional for local)

### 3. Supabase Database Setup
Run the SQL scripts in your Supabase SQL editor:
1. `scripts/setup-storage-bucket.sql` - Creates product-images bucket ✅ (already executed)
2. Other migration scripts if needed

### 4. Mark User as Admin (for uploads)
In Supabase, update the `profiles` table:
```sql
UPDATE profiles SET is_admin = true WHERE id = 'your-user-id';
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Testing Checklist

- [ ] App loads without styling issues
- [ ] Hero carousel rotates every 4 seconds with arrow controls
- [ ] Can login/logout
- [ ] Wishlist button works when logged in (no "not authorized" message)
- [ ] Add to cart works
- [ ] Admin dashboard accessible (if marked as admin)
- [ ] Can upload product images in admin (if bucket exists and user is admin)
- [ ] All prices display in ₵ (cedis)
- [ ] Checkout works with Stripe

## 🐛 Troubleshooting

### Styling not loading
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`
- Check `app/layout.tsx` has correct font setup

### Image upload fails with "Unauthorized"
- Verify user is marked as admin in `profiles.is_admin = true`
- Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check storage bucket `product-images` exists in Supabase

### Wishlist requires login when already logged in
- Clear browser cache/cookies
- Check `onAuthStateChange` is subscribed in `product-grid.tsx`
- Auth state should sync immediately after login

### Chunk load errors (Turbopack)
- These are dev-time bundler issues and don't affect production
- Solution: Clear `.next` folder and restart dev server
- `rm -rf .next && npm run dev`

## 📁 Project Structure

```
app/
  api/
    upload/route.ts          ← Admin image upload
    admin/users/route.ts     ← Admin user management
  auth/
    callback/route.ts        ← OAuth callback
    login/page.tsx
    sign-up/page.tsx
  cart/page.tsx
  products/[id]/page.tsx
  page.tsx                   ← Homepage with Hero
  layout.tsx                 ← Nunito font + Analytics wrapper
components/
  kiddieboo/
    hero.tsx                 ← Hero carousel with new images
    product-grid.tsx         ← Wishlist/cart with fixed auth
    admin/
      dashboard.tsx
      products-tab.tsx       ← Upload image form
      users-tab.tsx
      orders-tab.tsx
public/images/
  hero-1.webp               ← Hero slide 1
  hero-2.jpg                ← Hero slide 2
  avatar-*.jpg              ← Testimonial images
  products/                 ← Uploaded product images
scripts/
  setup-storage-bucket.sql  ← Storage bucket creation (executed)
```

## 🎯 Key Changes Made

| Issue | Fix | File |
|-------|-----|------|
| Hero image carousel | Added Embla carousel with autoplay | `components/kiddieboo/hero.tsx` |
| Wishlist auth | Changed to `onAuthStateChange` listener | `components/kiddieboo/product-grid.tsx` |
| Image upload auth | Use service role key for admin check | `app/api/upload/route.ts` |
| Currency | Normalize all to ₵ (cedis) | `components/kiddieboo/product-grid.tsx` |
| Local styling | Conditional Analytics + font fix | `app/layout.tsx` |
| Storage bucket | Created with proper policies | `scripts/setup-storage-bucket.sql` |

## 📞 Support

For issues:
1. Check debug logs: `npm run dev` (watch terminal)
2. Check Supabase logs: Dashboard → Logs
3. Check browser console: F12 → Console tab
4. Verify `.env.local` has all required keys

---

**Status**: ✅ Ready for local development
