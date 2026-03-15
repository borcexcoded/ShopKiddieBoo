# Environment Variables Setup Guide

This guide explains all environment variables needed to run KiddieBoo locally.

## Quick Setup

1. The `.env.local` file has been created with all required variables
2. Update the values with your actual credentials
3. Restart the development server after changes

## Required Variables

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase
```

**How to get these:**
1. Go to [supabase.com](https://supabase.com)
2. Create a project or sign in to existing one
3. Go to Settings > API
4. Copy the URL and keys

### Database (PostgreSQL)
```
POSTGRES_URL=postgresql://user:password@localhost:5432/kiddieboo
POSTGRES_PRISMA_URL=postgresql://user:password@localhost:5432/kiddieboo
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/kiddieboo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=kiddieboo
```

**Note:** If using Supabase, the database is hosted there. For local dev, either:
- Use Supabase's hosted database (easiest)
- Run PostgreSQL locally with Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -d postgres`

### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_MCP_KEY=your_mcp_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**How to get these:**
1. Go to [stripe.com](https://stripe.com)
2. Create a test account or sign in
3. Go to Developers > API Keys
4. Copy the publishable and secret test keys
5. For webhooks, use the test secret from Webhook Endpoints

### Vercel Blob Storage
```
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

**How to get this:**
1. Go to Vercel Dashboard
2. Go to Storage > Blob
3. Create a new store or use existing
4. Copy the token

### OAuth (Google Sign-In)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**How to get these:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Configure the consent screen
6. Copy the Client ID and Secret

### General Configuration
```
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## File Structure

```
.env.local                    ← Your actual credentials (don't commit!)
.env.local.example            ← Template for reference
```

## Important Notes

⚠️ **NEVER commit `.env.local` to Git!**
- It's already in `.gitignore`
- Contains sensitive credentials
- Each developer should have their own `.env.local`

✅ **DO share `.env.local.example`** as a template

## Verification

After setting up `.env.local`, verify everything works:

```bash
# Check if Supabase connection works
npm run dev

# Visit http://localhost:3000
# Try logging in - if it works, Supabase is configured
# Try adding to cart - if it works, database is configured
# Try checkout - if it works, Stripe is configured
```

## Troubleshooting

### "Missing environment variable X"
- Check `.env.local` has the variable
- Make sure you're not using the example file
- Restart the dev server after adding variables

### "Can't connect to Supabase"
- Verify URL and keys are correct
- Check internet connection
- Verify IP is whitelisted in Supabase (if applicable)

### "Can't upload images to Blob"
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check token is still valid in Vercel

### "Stripe checkout not working"
- Verify both `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` are correct
- Make sure they're both test keys (pk_test_ and sk_test_)
- For webhook testing, use `stripe listen` CLI

## Local Development Example

```bash
# 1. Create .env.local from template
cp .env.local.example .env.local

# 2. Edit .env.local with your credentials
nano .env.local

# 3. Make sure you have:
# - Supabase project with database
# - Stripe test account
# - Optional: Local PostgreSQL or use Supabase's hosted DB

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

## Currency Configuration

The app is configured to use **Ghana Cedis (GHS ₵)** as the default currency.

### To change currency:
1. Edit `/components/kiddieboo/product-grid.tsx`
2. Change the default currency in the `setCurrency` state:
```typescript
code: "GHS"  // Change to your currency code (USD, EUR, GBP, etc)
locale: "en-GH"  // Change to your locale
```
3. The app will auto-detect user's locale and use their country's currency
4. Restart the dev server

## Next Steps

1. Set up all environment variables in `.env.local`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Test all features (sign up, shop, checkout)
5. Ready to deploy!
