# Final Setup Checklist for Local Development

Complete this checklist to get KiddieBoo running locally on your device.

## Phase 1: Prerequisites ✅

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or pnpm installed (`npm --version`)
- [ ] Git installed (for version control)
- [ ] Code editor (VS Code recommended)
- [ ] Internet connection (for API access)

## Phase 2: Environment Variables 🔑

**File to edit:** `.env.local` (in project root)

### Supabase Setup
- [ ] Created Supabase account at https://supabase.com
- [ ] Created a new Supabase project
- [ ] Copied `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copied `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copied `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Pasted all three into `.env.local`

### Stripe Setup (Payment Processing)
- [ ] Created Stripe account at https://stripe.com
- [ ] Navigated to Developers > API Keys
- [ ] Found test mode keys (starts with pk_test_ and sk_test_)
- [ ] Copied `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] Copied `STRIPE_SECRET_KEY` (sk_test_...)
- [ ] Pasted both into `.env.local`

### Database Setup
- [ ] Using Supabase database (recommended): ✅ Already configured
- [ ] OR Local PostgreSQL: 
  - [ ] PostgreSQL installed locally
  - [ ] Updated `POSTGRES_URL` with connection string
  - [ ] Updated `POSTGRES_USER` and `POSTGRES_PASSWORD`
  - [ ] Created database named `kiddieboo`

### Vercel Blob (Image Upload - Optional)
- [ ] Visited Vercel Blob storage dashboard
- [ ] Copied `BLOB_READ_WRITE_TOKEN`
- [ ] Pasted into `.env.local`

### Google OAuth (Optional, for Google Sign-In)
- [ ] Visited https://console.cloud.google.com
- [ ] Created new project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID and Secret
- [ ] Pasted `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Phase 3: Local Images 🖼️

Create these image files in `/public/images/`:

### Hero Banner
- [ ] Prepared image file (1200x900px minimum, < 200KB)
- [ ] Named it `hero-banner.jpg`
- [ ] Placed in `/public/images/hero-banner.jpg`

### Testimonial Avatars (6 images)
- [ ] Prepared 6 image files (160x160px each, < 30KB each)
- [ ] Named them `avatar-1.jpg` through `avatar-6.jpg`
- [ ] Placed in `/public/images/`
  - [ ] `/public/images/avatar-1.jpg`
  - [ ] `/public/images/avatar-2.jpg`
  - [ ] `/public/images/avatar-3.jpg`
  - [ ] `/public/images/avatar-4.jpg`
  - [ ] `/public/images/avatar-5.jpg`
  - [ ] `/public/images/avatar-6.jpg`

## Phase 4: Install Dependencies 📦

```bash
cd path/to/kiddieboo-project
npm install
# or
pnpm install
```

- [ ] Navigated to project directory
- [ ] Ran `npm install` (or `pnpm install`)
- [ ] Installation completed without major errors
- [ ] `node_modules` folder created

## Phase 5: Start Development Server 🚀

```bash
npm run dev
```

- [ ] Ran `npm run dev`
- [ ] Server started successfully
- [ ] Output shows "Ready in X.XXs" or "Compiled successfully"
- [ ] No critical errors in terminal

## Phase 6: Verify in Browser 🌐

Visit `http://localhost:3000`

### Homepage
- [ ] Page loads without errors
- [ ] Hero image displays correctly
- [ ] Testimonials carousel shows
- [ ] Navigation menu works

### Authentication
- [ ] Sign up button works
- [ ] Email/password sign-up works
- [ ] Google sign-in button appears
- [ ] Login page accessible
- [ ] Password reset link works

### Shopping
- [ ] Products display correctly
- [ ] Product images load from database
- [ ] Prices show in GHS (₵) currency
- [ ] Add to cart button works
- [ ] Wishlist heart button works
- [ ] Cart page shows items

### Checkout
- [ ] Stripe payment form loads
- [ ] Test card numbers work
- [ ] Order creation works
- [ ] Order confirmation displays

### Admin Dashboard
- [ ] Admin can access `/admin`
- [ ] Products tab shows all products
- [ ] Orders tab shows all orders
- [ ] Users tab shows all users
- [ ] Messages tab shows contact forms
- [ ] Featured products toggle works
- [ ] Can create new products
- [ ] Can delete products

## Phase 7: Test Features ⚡

### User Features
- [ ] Can sign up with email
- [ ] Can log in
- [ ] Can update profile
- [ ] Can add to wishlist
- [ ] Can add to cart
- [ ] Can view order history
- [ ] Can contact support

### Admin Features
- [ ] Can toggle product featured status
- [ ] Can add/edit products
- [ ] Can delete products
- [ ] Can view all users
- [ ] Can promote user to admin
- [ ] Can view all orders
- [ ] Can mark orders as shipped

### Currency
- [ ] Prices display in GHS (₵)
- [ ] Currency formatting is correct
- [ ] Symbol shows correctly

## Phase 8: Optional - Vercel Setup 🌍

When ready to deploy:

- [ ] Pushed code to GitHub
- [ ] Connected GitHub repo to Vercel
- [ ] Set environment variables in Vercel project settings
- [ ] Deployment successful
- [ ] Live app accessible at Vercel URL

## 🎉 Success Indicators

You'll know everything is working when:

✅ App loads at `http://localhost:3000`  
✅ Can sign up and log in  
✅ Products show with GHS currency  
✅ Can add items to cart  
✅ Stripe test payment works  
✅ Admin dashboard accessible  
✅ Images load from `/public/images/`  
✅ No console errors (minor warnings OK)  

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't find module" | Run `npm install` again |
| "Port 3000 in use" | Change port: `npm run dev -- -p 3001` |
| ".env.local not found" | Copy `.env.local.example` to `.env.local` |
| "Invalid credentials" | Double-check API keys in `.env.local` |
| "Images not loading" | Verify files exist in `/public/images/` |
| "Database error" | Check Supabase connection in `.env.local` |
| "Stripe error" | Ensure using test keys (pk_test_, sk_test_) |

## 📞 Need Help?

1. **Environment Variables Issues?** → Read `ENV_SETUP.md`
2. **Image Problems?** → Read `LOCAL_IMAGES_GUIDE.md`
3. **Can't Run App?** → Read `RUN_LOCALLY.md`
4. **Deployment Questions?** → Read `DEPLOYMENT.md`
5. **Database Setup?** → Read `SUPABASE_SETUP.md`

---

## 🎯 What You Have Now

A fully functional e-commerce platform with:

- User authentication (email/password + Google OAuth)
- Product catalog with image uploads
- Shopping cart and wishlist
- Stripe payment processing
- Order tracking
- Admin dashboard
- User management
- Multi-currency support (GHS default)
- Fully responsive design
- Ready for local testing and production deployment

---

**Good luck! Your KiddieBoo app is now ready to run locally! 🚀**
