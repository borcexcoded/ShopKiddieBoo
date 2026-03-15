# KiddieBoo - Children's E-Commerce Platform

A modern, full-featured e-commerce platform for selling children's clothing and accessories. Built with Next.js 16, Supabase, Stripe, and Tailwind CSS.

## Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse products by category with filtering and search
- **Product Details**: View detailed product information with images, sizes, and inventory
- **Shopping Cart**: Add items, adjust quantities, and save items for later
- **Wishlist**: Save favorite items with one-click toggle
- **Size Inventory**: Per-size stock tracking - out of stock sizes are disabled
- **Shimmer Loading**: Smooth loading states on all product pages

### 💳 Checkout & Payment
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Order Tracking**: Unique tracking numbers generated automatically
- **Payment Webhook**: Automatic order confirmation and inventory reduction
- **Email Notifications**: Order confirmation emails via Supabase Auth

### 📦 Order Management
- **Order History**: View all past orders with tracking information
- **Real-time Updates**: Track order status from pending to delivered
- **Inventory Management**: Automatic stock reduction when orders are paid
- **Order Details**: View itemized orders with sizes and prices

### 👥 User Management
- **Authentication**: Supabase Auth with email/password
- **User Profiles**: Store customer information and preferences
- **Admin Roles**: Promote users to admin via admin dashboard
- **Wishlist**: Personalized saved items

### 🔧 Admin Dashboard
- **Products Tab**: Create, edit, delete products with per-size inventory
- **Orders Tab**: View, update, and track customer orders with tracking numbers
- **Users Tab**: Manage user roles and permissions
- **Messages Tab**: Handle customer inquiries from contact form
- **Statistics**: Overview of products, orders, and messages

### 📱 Responsive Design
- Mobile-first design
- Tablet and desktop optimized
- Touch-friendly buttons and navigation
- Fast loading with image optimization

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Pre-built, accessible components
- **React Hook Form**: Form management

### Backend & Services
- **Supabase**: PostgreSQL database, Auth, and RLS
- **Stripe**: Payment processing
- **Vercel**: Hosting and deployment
- **Next.js API Routes**: Serverless functions

### Database
- **PostgreSQL**: Relational database via Supabase
- **Row Level Security (RLS)**: Fine-grained access control
- **Real-time Subscriptions**: Live data updates

## Project Structure

```
kiddieboo/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── shop/                     # Shop page
│   ├── products/[id]/            # Product details page
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout page
│   ├── admin/                    # Admin dashboard
│   ├── track-order/              # Order tracking
│   ├── auth/                     # Authentication pages
│   ├── actions/                  # Server actions
│   └── api/                      # API routes
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── kiddieboo/                # Custom app components
│   │   ├── admin/                # Admin UI components
│   │   ├── header.tsx            # Navigation header
│   │   ├── footer.tsx            # Footer
│   │   └── ...
│   └── shimmer-skeleton.tsx      # Loading skeletons
├── lib/
│   ├── supabase/                 # Supabase client & server
│   ├── stripe.ts                 # Stripe configuration
│   ├── orders.ts                 # Order utilities
│   └── utils.ts                  # Helper functions
├── scripts/                      # Database migrations
├── public/                       # Static assets
├── styles/                       # Global styles
└── ...
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Stripe account
- GitHub account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kiddieboo
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Initialize Supabase database**
Run SQL migrations from `scripts/` folder in order

5. **Start development server**
```bash
pnpm dev
```

Visit http://localhost:3000

## Key Files

### Database Migrations
- `scripts/001-init-schema.sql` - Initial database schema
- `scripts/002-add-profiles-table.sql` - User profiles with admin roles
- `scripts/003-add-size-inventory.sql` - Per-size inventory tracking

### Server Actions
- `app/actions/stripe.ts` - Stripe checkout and payment handling
- `lib/orders.ts` - Order creation and inventory management

### API Routes
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler
- `app/api/upload/route.ts` - Image upload handler

### Admin Components
- `components/kiddieboo/admin/dashboard.tsx` - Main admin dashboard
- `components/kiddieboo/admin/products-tab.tsx` - Product management
- `components/kiddieboo/admin/orders-tab.tsx` - Order management
- `components/kiddieboo/admin/users-tab.tsx` - User role management

## Features in Detail

### Shimmer Loading
All pages use React Suspense with shimmer skeleton loaders for smooth data loading.

### Wishlist Toggle
Click the heart icon to add/remove items from wishlist. When added, the button turns black.

### Add to Cart Protection
The "Add to Cart" button is disabled while processing to prevent duplicate additions.

### Size Inventory
- Admins can set stock quantity per size
- Out-of-stock sizes are grayed out and disabled
- Inventory automatically decreases after payment

### Order Tracking
- Unique tracking number assigned to each order
- Customers can track orders by order number or tracking number
- Real-time status updates from admin panel

### Admin Role Management
- Only admins can access `/admin` dashboard
- Promote users to admin through Users tab
- Admin email can be customized via environment variable

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Vercel
1. Push code to GitHub
2. Connect repository in Vercel
3. Add environment variables
4. Deploy (automatic on push)

## Database Schema

### Products Table
- `id` (UUID) - Primary key
- `name` - Product name
- `description` - Long description
- `price` - Regular price
- `sale_price` - Discounted price (optional)
- `category` - Product category
- `image_url` - Product image URL
- `sizes` - Array of available sizes
- `colors` - Array of available colors
- `size_inventory` - JSON object with quantity per size
- `in_stock` - Stock availability flag
- `featured` - Homepage feature flag

### Orders Table
- `id` - Order ID
- `user_id` - Customer user ID
- `order_number` - Human-readable order number
- `tracking_number` - Unique tracking number
- `items` - Order items JSON
- `total` - Order total amount
- `status` - Order status
- `stripe_session_id` - Stripe session reference
- `created_at` - Order creation time

### Profiles Table
- `id` - User ID (from auth)
- `email` - User email
- `is_admin` - Admin flag
- `created_at` - Profile creation time

## API Documentation

### Checkout
`POST /api/checkout/create-session`
- Creates Stripe checkout session
- Requires authenticated user
- Cart items converted to Stripe line items

### Webhooks
`POST /api/webhooks/stripe`
- Handles payment completion
- Creates order record
- Reduces inventory
- Clears customer cart

## Customization

### Email Templates
Configure custom email templates in Supabase:
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize sender name to "Shop KiddieBoo"
3. Modify email content as needed

### Admin Email
Set admin email in header component or use environment variable

### Colors & Branding
Edit `globals.css` for theme colors and design tokens

## Performance Optimization

- ✅ Image optimization with Next.js Image
- ✅ Shimmer loading states
- ✅ Database query optimization with indexes
- ✅ Serverless functions for API routes
- ✅ CDN distribution via Vercel

## Security

- ✅ Row Level Security (RLS) on all Supabase tables
- ✅ Server-side validation
- ✅ Secure Stripe webhook verification
- ✅ HTTPS for all connections
- ✅ Environment variable protection
- ✅ SQL injection prevention via Supabase SDK

## Troubleshooting

**Products not loading?**
- Check Supabase connection
- Verify API keys in environment variables

**Stripe payments failing?**
- Confirm webhook secret is correct
- Test with Stripe test keys first
- Check webhook endpoint in Stripe dashboard

**Admin access denied?**
- Verify `is_admin` flag in profiles table
- Check user email matches admin user

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Commit with clear messages
5. Push and create Pull Request

## License

MIT License - Feel free to use this project commercially or personally.

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Built with ❤️ for KiddieBoo**
