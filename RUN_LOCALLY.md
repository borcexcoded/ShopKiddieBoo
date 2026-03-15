# Running KiddieBoo Locally on Your Device

This guide walks you through running the KiddieBoo app on your local machine step-by-step.

## Prerequisites (Check These First)

1. **Node.js 18+** installed
   ```bash
   node --version  # Should show v18.0.0 or higher
   ```
   If not installed: Download from [nodejs.org](https://nodejs.org)

2. **pnpm** package manager
   ```bash
   pnpm --version  # Should show a version number
   ```
   If not installed:
   ```bash
   npm install -g pnpm
   ```

3. **Git** installed
   ```bash
   git --version  # Should show git version
   ```
   If not installed: Download from [git-scm.com](https://git-scm.com)

4. **Accounts Created**
   - Supabase account (https://supabase.com)
   - Stripe account (https://stripe.com)

## Step-by-Step Setup

### Step 1: Download the Project

Choose one method:

**Option A: Clone from GitHub** (Recommended)
```bash
git clone https://github.com/YOUR_USERNAME/kiddieboo.git
cd kiddieboo
```

**Option B: Download as ZIP**
1. Go to GitHub repo
2. Click Code → Download ZIP
3. Extract the ZIP file
4. Open terminal in the extracted folder

### Step 2: Install Dependencies

**On macOS/Linux:**
```bash
./setup-local.sh
```

**On Windows:**
```bash
# Delete the old node_modules folder if it exists
rmdir /s node_modules

# Reinstall dependencies
pnpm install
```

This will take 2-3 minutes. You'll see progress bars and should end without errors.

### Step 3: Create Environment File

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in a text editor

3. Fill in your credentials:

**For Supabase:**
- Go to https://supabase.com/dashboard
- Select your project
- Click Settings → API
- Copy `Project URL` → paste in `.env` as `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

**For Stripe:**
- Go to https://dashboard.stripe.com
- Click Developers → API keys
- Copy `Publishable key` → paste as `STRIPE_PUBLIC_KEY`
- Copy `Secret key` → paste as `STRIPE_SECRET_KEY`
- For `STRIPE_WEBHOOK_SECRET`, leave blank for now (used in production)

**Example `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
```

### Step 4: Setup Database

1. Go to Supabase Dashboard
2. Click SQL Editor (left sidebar)
3. Click "New Query"
4. Copy the contents of `scripts/001_create_tables.sql`
5. Paste into Supabase SQL editor
6. Click "Run" (or press Cmd+Enter)

**Repeat for each migration file:**
- `scripts/002-add-profiles-table.sql`
- `scripts/002_seed_data.sql`
- `scripts/003-add-size-inventory.sql`
- `scripts/003_admin_policies.sql`

**✅ Database is ready when all scripts run without errors**

### Step 5: Start the Development Server

```bash
pnpm dev
```

You should see:
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### Step 6: Open in Browser

Open your browser and go to: **http://localhost:3000**

You should see the KiddieBoo homepage loading!

## Testing Locally

### Test the Homepage
- [ ] Page loads without errors
- [ ] Products display with images
- [ ] Brands carousel works
- [ ] Testimonials show

### Test Shopping
1. Click "Shop" in header
2. [ ] All products load
3. Click on a product
4. [ ] Product details page loads
5. [ ] Can see sizes, colors, price
6. [ ] "Add to Cart" button works

### Test Wishlist
1. On product page, click heart icon
2. [ ] Heart should turn orange
3. [ ] Item added to wishlist
4. Click wishlist icon in header
5. [ ] See saved item

### Test Cart
1. Add item to cart (click "Add to Cart")
2. Click cart icon in header
3. [ ] Item shows in cart
4. [ ] Can change quantity
5. Click "Checkout"

### Test Payment (With Test Card)
1. Should see Stripe checkout form
2. Use test card: **4242 4242 4242 4242**
3. Any future date (e.g., 12/26)
4. Any 3-digit CVC (e.g., 123)
5. [ ] Payment should succeed
6. [ ] You're redirected to success page

### Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Should see admin dashboard
3. [ ] View Products, Orders, Users tabs
4. [ ] Can add product
5. [ ] Can update product
6. [ ] Can delete product

## Troubleshooting

### "Port 3000 is already in use"
Another app is using port 3000. Either:
- Close the other app, OR
- Run on different port: `pnpm dev -p 3001`

### "Cannot find module 'next'"
Dependencies not installed properly:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "Supabase URL is not set"
Your `.env.local` file is missing or incomplete:
```bash
cp .env.local.example .env.local
# Then fill in all the values
```

### "Cannot read property 'signUp' of undefined"
Supabase keys are wrong. Double-check in Supabase dashboard and `.env.local`

### "Turbopack Error: symlink"
Run the setup script again:
```bash
./setup-local.sh
```

### "Build fails with TypeScript errors"
Make sure all environment variables are set:
```bash
cat .env.local  # Check all vars are filled
pnpm dev        # Try again
```

### Database tables not showing in Supabase
1. Go to Supabase → SQL Editor
2. Click the refresh icon
3. Go to Table Editor on left
4. You should see: products, orders, cart, etc.

### Images not loading
This is expected in local dev. They'll work in production with image hosting.

## Tips for Development

### Hot Reload
- Edit any file and save
- Browser automatically refreshes
- No need to restart the dev server

### Database Changes
- Edit and save code files
- Changes reload automatically
- Database schema changes require new migrations

### Debug Mode
- Open browser DevTools (F12 or Cmd+I)
- Go to Console tab
- You'll see logs and errors
- Check Network tab for API issues

### Check Environment Variables
```bash
# Make sure .env.local exists and is not empty
cat .env.local
```

### Stop the Server
Press `Ctrl+C` in the terminal to stop the dev server

### Restart the Server
```bash
# Stop it first (Ctrl+C)
# Then start again
pnpm dev
```

## What If Something Breaks?

### Nuclear Option (Resets Everything)
```bash
# Stop the dev server (Ctrl+C)

# Delete cached files
rm -rf .next node_modules

# Reinstall everything
pnpm install

# Clear browser cache
# (Ctrl+Shift+Delete in most browsers)

# Start fresh
pnpm dev
```

### Check Logs
- Terminal shows Next.js logs
- Browser console (F12) shows frontend errors
- Supabase logs at https://supabase.com/dashboard

## You're Ready!

Once you see the homepage loading at http://localhost:3000, you're successfully running KiddieBoo locally!

### Next Steps:
1. Explore the app by clicking around
2. Test the features (shopping, cart, wishlist)
3. Try the admin dashboard
4. Make changes to the code and see them reload
5. When ready, deploy to Vercel (see DEPLOYMENT.md)

## More Help

- `README.md` - Full project documentation
- `LOCAL_SETUP.md` - More detailed setup info
- `QUICK_START.md` - Quick overview
- `FEATURES.md` - Feature documentation
- Browser console (F12) - See errors and logs
- Supabase dashboard - Check database, auth

## Common Questions

**Q: Do I need to keep the terminal open?**
A: Yes, the terminal runs the dev server. Keep it running while developing.

**Q: Can I make changes while it's running?**
A: Yes! Save any file and the page auto-refreshes.

**Q: Can I deploy directly from my computer?**
A: No, you need to push to GitHub first. See DEPLOYMENT.md

**Q: How do I run tests?**
A: No tests yet. You can add Jest configuration if needed.

**Q: Can I use npm instead of pnpm?**
A: Yes, use `npm install` and `npm run dev` instead.

---

**You've got this! Happy coding! 🚀**

If you get stuck, check the error message carefully - it usually tells you what's wrong. When in doubt, restart the dev server!
