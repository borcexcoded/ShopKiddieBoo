# Running KiddieBoo Locally

## Prerequisites

- **Node.js** v18+ (download from https://nodejs.org/)
- **pnpm** or **npm** (pnpm is recommended)
  - Install pnpm: `npm install -g pnpm`

## Quick Start

### 1. Fix Node Modules Symlink Issue

If you get a "Symlink node_modules is invalid" error, run the cleanup script:

```bash
# On macOS/Linux:
chmod +x setup-local.sh
./setup-local.sh

# On Windows (PowerShell):
# Delete node_modules folder manually, then run:
npm install
# or
pnpm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local with your credentials
```

You need:
- **Supabase** credentials (free tier available)
  - Go to: https://supabase.com/dashboard
  - Create a new project
  - Copy `Project URL` and `anon key` from Settings > API
  - Create a service role key from Settings > API

- **Stripe** credentials (optional, only if testing checkout)
  - Go to: https://dashboard.stripe.com/
  - Copy your publishable and secret keys
  - Set mode to Test

- **Blob Storage** token (optional, only if testing image uploads)
  - Go to: https://vercel.com/dashboard
  - Navigate to Storage > Blob
  - Create a token

### 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### "Port 3000 is in use"
The dev server will automatically use the next available port (3001, 3002, etc).

### "NEXT_PUBLIC_SUPABASE_URL is required"
Make sure you've created `.env.local` and filled in the Supabase credentials.

### Turbopack Errors
If you encounter Turbopack-related errors:
1. Edit `next.config.mjs`
2. Uncomment: `turbopack: false,`
3. Restart the dev server
4. The app will use standard webpack instead

### Build Errors
```bash
# Clear all caches and reinstall:
rm -rf .next node_modules
pnpm install
npm run dev
```

## Running Production Build Locally

```bash
npm run build
npm run start
```

## Project Structure

```
/app          - Next.js pages and layouts
/components   - React components
/lib          - Utilities and helpers
/public       - Static assets
/scripts      - Setup and migration scripts
```

## Deploying to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables in Settings > Environment Variables
5. Deploy!

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
