# 🎯 START HERE - KiddieBoo Setup Guide

Welcome! This guide will get your KiddieBoo e-commerce app running locally in 30-45 minutes.

## ⚡ Quick Start (TL;DR)

```bash
# 1. Edit .env.local with your API credentials
nano .env.local

# 2. Add images to /public/images/
# (7 files: hero-banner.jpg + 6 avatars)

# 3. Install dependencies
npm install

# 4. Start the app
npm run dev

# 5. Visit http://localhost:3000
```

---

## 📖 Complete Setup Guide

### Step 1: Environment Variables (10 minutes)

**File:** `.env.local` (in project root)

#### a) Open the file
```bash
nano .env.local
# or use your code editor: VS Code, etc.
```

#### b) Update Supabase credentials
From: https://supabase.com
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

#### c) Update Stripe credentials
From: https://stripe.com (use test keys!)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### d) Database credentials (if using local PostgreSQL)
```
POSTGRES_URL=postgresql://user:password@localhost:5432/kiddieboo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_DATABASE=kiddieboo
```

#### e) Vercel Blob (optional, for image uploads)
From: Vercel Dashboard > Storage > Blob
```
BLOB_READ_WRITE_TOKEN=your-blob-token
```

#### f) Save the file

✅ **Full guide:** See `ENV_SETUP.md`

### Step 2: Add Local Images (5-15 minutes)

**Folder:** `/public/images/`

#### Create these 7 image files:

**Hero Banner:**
- File: `hero-banner.jpg`
- Size: 1200x900px (minimum)
- Size: < 200KB
- Source: Your own or free from Pexels/Unsplash

**Testimonial Avatars (6 files):**
- Files: `avatar-1.jpg` through `avatar-6.jpg`
- Size: 160x160px (square)
- Size: < 30KB each
- Source: Your own or free from Pexels/Unsplash/Gravatar

#### Where to download free images:
- [Pexels](https://pexels.com) — Free high-quality photos
- [Unsplash](https://unsplash.com) — Free stock photos
- [Pixabay](https://pixabay.com) — Free images
- [Picjumbo](https://picjumbo.com) — Free photos

#### How to optimize images:
- Use [Squoosh](https://squoosh.app) (Google's optimizer)
- Or [TinyPNG](https://tinypng.com)
- Or use ImageMagick: `convert input.jpg -quality 85 output.jpg`

✅ **Full guide:** See `LOCAL_IMAGES_GUIDE.md`

### Step 3: Install Dependencies (2-5 minutes)

```bash
# Navigate to project directory
cd path/to/kiddieboo-project

# Install all dependencies
npm install
# or if using pnpm:
pnpm install
```

Wait for installation to complete. You should see `added X packages`.

### Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

You should see output like:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Test in Browser (5-10 minutes)

Open: **http://localhost:3000**

#### Test these features:
- [ ] Home page loads
- [ ] Hero image shows
- [ ] Products display
- [ ] Prices show in GHS (₵)
- [ ] Sign up works
- [ ] Log in works
- [ ] Add to cart works
- [ ] Add to wishlist works
- [ ] Stripe test payment works
- [ ] Admin dashboard accessible

---

## 🎯 Key Information

### Currency
- **Default:** Ghana Cedis (GHS ₵)
- **Auto-Detection:** Enabled (shows user's region currency)
- **To change:** Edit `components/kiddieboo/product-grid.tsx`

### Images
- **All from local folder:** `/public/images/`
- **Not from external URLs anymore**
- **Faster loading, offline support**

### API Keys
- **All in `.env.local`** (don't commit!)
- **Use test keys for development** (pk_test_, sk_test_)
- **Keep secret, never share**

---

## 📚 Documentation Guide

Read these in order based on your needs:

| Document | Purpose | Read When |
|----------|---------|-----------|
| **FINAL_CHECKLIST.md** | Complete step-by-step | First time setup |
| **ENV_SETUP.md** | How to get API credentials | Need API keys |
| **LOCAL_IMAGES_GUIDE.md** | Image management | Need to add images |
| **RUN_LOCALLY.md** | Detailed local setup | Having issues |
| **EVERYTHING_DONE.md** | What's completed | Want overview |
| **DEPLOYMENT.md** | How to deploy to Vercel | Ready to go live |
| **SUPABASE_SETUP.md** | Database configuration | Need DB help |
| **GITHUB_VERCEL_CHECKLIST.md** | Pre-deployment checklist | Before deploying |

---

## 🆘 Troubleshooting

### "I don't have my API credentials"
→ See `ENV_SETUP.md` for step-by-step how to get them

### "Images not showing"
→ Check files exist in `/public/images/` with correct names

### "Port 3000 already in use"
→ Use different port: `npm run dev -- -p 3001`

### "Can't connect to database"
→ Verify credentials in `.env.local`

### "Stripe not working"
→ Make sure using test keys (pk_test_, sk_test_)

### "Build/Install errors"
→ Run `npm install` again or check Node.js version (need 18+)

---

## ✅ Success Checklist

You'll know it's working when:

- ✅ App loads at `http://localhost:3000`
- ✅ No red errors in browser console
- ✅ Can create account and log in
- ✅ Products show with GHS prices
- ✅ Images load from `/public/images/`
- ✅ Admin dashboard accessible at `/admin`
- ✅ Test payment succeeds

---

## 🚀 What Comes Next?

### After local testing works:

1. **Test all features thoroughly**
2. **Fix any bugs** (use browser console for errors)
3. **Deploy to Vercel** (see `DEPLOYMENT.md`)
4. **Add production credentials** (real Stripe keys, etc.)
5. **Monitor live app** (check for errors)

---

## 📞 Still Need Help?

### For specific topics:
- **API Keys Issues** → Read `ENV_SETUP.md`
- **Image Problems** → Read `LOCAL_IMAGES_GUIDE.md`
- **Can't Run App** → Read `FINAL_CHECKLIST.md`
- **Deployment** → Read `DEPLOYMENT.md`
- **Database** → Read `SUPABASE_SETUP.md`

### For console errors:
1. Check browser's Developer Console (F12)
2. Read the error message
3. Search for that error in the documentation
4. If still stuck, check the specific guide above

---

## 💡 Pro Tips

- Use VS Code for best experience
- Keep `.env.local` secret (in `.gitignore`)
- Use test API keys during development
- Check browser console for errors (F12)
- Use `npm run dev -- -p 3001` if port conflicts
- Clear browser cache if images don't update

---

## 🎉 You're Ready!

You have everything you need. Just follow the 5 steps above and you'll have KiddieBoo running locally.

**Estimated time:** 30-45 minutes

**Let's go! 🚀**

---

## Quick Links

- [Supabase](https://supabase.com) - Database & Auth
- [Stripe](https://stripe.com) - Payments
- [Vercel](https://vercel.com) - Deployment
- [Node.js](https://nodejs.org) - Runtime
- [VS Code](https://code.visualstudio.com) - Editor

---

**Next step:** Open `.env.local` and start updating your credentials!
