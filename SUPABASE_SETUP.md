# KiddieBoo Supabase Setup Guide

## Customizing Authentication Email

To customize the email that users receive when signing up for KiddieBoo:

### 1. Log in to Supabase Dashboard
- Go to [supabase.com](https://supabase.com)
- Select your KiddieBoo project

### 2. Configure Email Templates
- Navigate to **Authentication** → **Email Templates**
- You'll see templates for:
  - Confirm signup
  - Invite user
  - Magic link
  - Change email address
  - Reset password

### 3. Edit Email Templates
1. Click on the template you want to customize
2. Update the subject line to include "Shop KiddieBoo"
3. Customize the email body and branding
4. Click **Save**

### Example Email Subject Lines
- **Confirm signup**: "Confirm your Shop KiddieBoo account"
- **Reset password**: "Reset your Shop KiddieBoo password"
- **Magic link**: "Your Shop KiddieBoo login link"

## Managing User Roles

### Making a User an Admin

1. Go to the **Admin** → **Users** tab in the KiddieBoo dashboard
2. Find the user you want to promote
3. Click the **Make Admin** button
4. The user will now have access to the admin dashboard

### Removing Admin Access

1. Go to the **Admin** → **Users** tab
2. Find the admin user
3. Click the **Remove Admin** button
4. The user will be downgraded to a regular customer

## Order Tracking System

### How Orders Are Created

1. When a customer completes a Stripe payment, the system automatically:
   - Generates a unique **Order Number** (format: `ORD-YYYYMMDD-XXXXX`)
   - Generates a unique **Tracking Number** (format: `KB-TIMESTAMP-RANDOM`)
   - Creates an order record in the database
   - Clears the customer's cart

2. The customer receives the **Tracking Number** to track their order

### Admin Order Management

1. Go to the **Admin** → **Orders** tab
2. For each order, you can:
   - View order details and customer info
   - Add or update the **Tracking Number**
   - Copy the tracking number to clipboard
   - Update the order **Status**: pending → processing → shipped → delivered (or cancelled)

3. When you update the status, the customer can see the update on the **Track Order** page

### Order Statuses

- **pending**: Order received, awaiting processing
- **processing**: Order being prepared for shipment
- **shipped**: Order has been shipped
- **delivered**: Order has been delivered
- **cancelled**: Order has been cancelled

## Database Schema

### Profiles Table
- `id` - User ID (UUID)
- `email` - User email
- `is_admin` - Boolean flag (true = admin)
- `created_at` - When the profile was created

### Orders Table
- `id` - Order ID (UUID)
- `user_id` - Customer ID
- `order_number` - Human-readable order ID (e.g., `ORD-20250311-12345`)
- `tracking_number` - Tracking number (e.g., `KB-ABCDEF-GHIJKL`)
- `status` - Current order status
- `items` - Array of order items
- `total_amount` - Total order value
- `stripe_session_id` - Reference to Stripe checkout session
- `created_at` - When the order was created
- `updated_at` - Last update timestamp

## Webhook Configuration (Optional)

For production, configure Stripe webhooks to automatically handle payment confirmations:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. The webhook will automatically create orders when payments succeed

## Testing

### Test Admin Access
1. Set a user's `is_admin` field to `true` in the profiles table
2. Sign in as that user
3. You should see the **Admin** button in the header

### Test Order Tracking
1. Complete a test payment
2. Check the Orders tab for the new order
3. Add a tracking number
4. Go to Track Order and search for the tracking number
