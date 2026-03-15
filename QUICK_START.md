# KiddieBoo - Quick Start Guide

## 5-Minute Local Setup

### Prerequisites
- Node.js 18+ installed
- GitHub account
- Supabase account with a project
- Stripe account

### Step 1: Clone & Install (1 min)
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/kiddieboo.git
cd kiddieboo

# Clean install (fixes symlink issues)
./setup-local.sh
# OR on Windows:
rm -r node_modules pnpm-lock.yaml
pnpm install
```

### Step 2: Configure Environment (2 min)
1. Copy `.env.local.example` to `.env.local`
2. Fill in your credentials:
   - Supabase URL and keys (from Supabase dashboard)
   - Stripe keys (from Stripe dashboard)

```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Step 3: Setup Database (1 min)
1. Go to Supabase dashboard
2. Open SQL editor
3. Copy-paste and run each migration in order:
   - `scripts/001_create_tables.sql`
   - `scripts/002-add-profiles-table.sql`
   - `scripts/002_seed_data.sql`
   - `scripts/003-add-size-inventory.sql`
   - `scripts/003_admin_policies.sql`

### Step 4: Run Locally (1 min)
```bash
pnpm dev
```
Open http://localhost:3000

## Create Test Admin Account

1. Sign up with email: `test@example.com`
2. Go to http://localhost:3000/admin
3. You should see the admin dashboard!

## Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy KiddieBoo"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to vercel.com/new
2. Select your GitHub repo
3. Click "Import"

### Step 3: Add Environment Variables
In Vercel project settings, add all variables from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Step 4: Deploy
Click "Deploy" and wait ~5 minutes

## Testing Locally

### Homepage
- [ ] Hero section loads
- [ ] Featured products display
- [ ] Brands carousel works
- [ ] Testimonials show

### Shopping
- [ ] Browse /shop
- [ ] Filter by category
- [ ] Search works
- [ ] Click product → details page loads

### Wishlist
- [ ] Click heart icon
- [ ] Heart turns orange
- [ ] Item saved to wishlist

### Cart & Checkout
- [ ] Add item to cart
- [ ] Cart updates
- [ ] Go to /cart
- [ ] Checkout button works
- [ ] Stripe modal appears (test card: `4242 4242 4242 4242`)

### Order Tracking
- [ ] After payment, get order number
- [ ] Go to /track-order
- [ ] Search by order number
- [ ] See order details

### Admin Dashboard
- [ ] Go to /admin
- [ ] View Products tab
- [ ] View Orders tab
- [ ] View Users tab
- [ ] View Messages tab

## Common Issues

### "Supabase URL is not set"
→ Check `.env.local` has correct variables

### "Google OAuth not working"
→ Configure provider in Supabase Auth settings

### "Payment fails"
→ Use Stripe test card: `4242 4242 4242 4242`

### "Images not loading"
→ Configure Vercel Blob storage (optional)

### "Turbopack errors"
→ Run `./setup-local.sh` to clean node_modules

## Documentation Files

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Complete deployment guide
- **LOCAL_SETUP.md** - Detailed local setup
- **SUPABASE_SETUP.md** - Database configuration
- **FEATURES.md** - Feature details
- **GITHUB_VERCEL_CHECKLIST.md** - Pre-deployment checklist
- **IMPLEMENTATION_SUMMARY.md** - What was built

## Support

For help:
1. Check the relevant documentation file above
2. Search GitHub issues
3. Contact support

## Next Steps

1. ✅ Local setup complete
2. ⬜ Push to GitHub
3. ⬜ Deploy to Vercel
4. ⬜ Configure custom domain
5. ⬜ Setup email templates
6. ⬜ Test payment flow
7. ⬜ Go live!

---

**That's it! KiddieBoo is ready to run locally and deploy to production.** 🚀
