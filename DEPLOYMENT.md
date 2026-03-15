# KiddieBoo Deployment Guide

## Prerequisites
- Node.js 18+ and pnpm installed
- GitHub account
- Vercel account
- Supabase account
- Stripe account

## Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd kiddieboo
pnpm install
```

### 2. Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Setup Supabase Database
Run all SQL migrations in order:
```bash
# These migrations set up the database schema
# 001-init-schema.sql
# 002-add-profiles-table.sql
# 003-add-size-inventory.sql
```

### 4. Local Development
```bash
pnpm dev
# Opens at http://localhost:3000
```

## Deployment to Vercel

### 1. Connect GitHub Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Select the repository from the list

### 2. Configure Environment Variables
In Vercel project settings, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL` (set to your production domain)

### 3. Deploy
Click "Deploy" - Vercel will automatically build and deploy on every push to main branch.

## Database Schema

### Core Tables
- **products**: Store product information with sizes and per-size inventory
- **cart**: Shopping cart items
- **orders**: Order history with tracking numbers
- **wishlist**: User wishlist items
- **profiles**: User profiles with admin flag
- **contact_messages**: Contact form submissions
- **testimonials**: Customer testimonials

### Key Features
- **Size Inventory**: Track stock per size with `size_inventory` JSON field
- **Order Tracking**: Auto-generated tracking numbers and order numbers
- **Admin Management**: Toggle user roles via `is_admin` field in profiles
- **Row Level Security**: Policies protect user data

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Events to listen for: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Features & API Routes

### Public Routes
- `/` - Homepage
- `/shop` - Product catalog
- `/products/[id]` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/track-order` - Order tracking
- `/auth/*` - Authentication

### Admin Routes
- `/admin` - Admin dashboard (requires admin role)
- Admin tabs: Products, Orders, Users, Messages

### API Routes
- `POST /api/upload` - Image upload
- `POST /api/webhooks/stripe` - Stripe payment webhook
- `POST /api/checkout` - Create checkout session

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase database initialized with migrations
- [ ] Stripe webhook endpoint configured
- [ ] Authentication (Supabase Auth) enabled
- [ ] First admin user created (manual insert to profiles table)
- [ ] Custom email templates configured in Supabase
- [ ] Domain configured in Vercel
- [ ] SSL certificate auto-provisioned by Vercel
- [ ] Test payment flow with Stripe test keys
- [ ] Verify order tracking works end-to-end

## Troubleshooting

### "Supabase connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify Supabase project is active

### "Stripe payment failing"
- Verify webhook secret matches in Stripe dashboard
- Check webhook endpoint is configured correctly
- Test with Stripe test keys first

### "Admin dashboard not accessible"
- Ensure user has `is_admin = true` in profiles table
- Clear browser cache and re-login

### "Images not uploading"
- Check upload API is working
- Verify blob storage is configured
- Check file size limits

## Performance Tips

- Use Vercel Analytics to monitor performance
- Enable Incremental Static Regeneration (ISR) for product pages
- Compress images with Vercel Image Optimization
- Monitor database queries in Supabase

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs
