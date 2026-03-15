'use server'

import { stripe } from '../../lib/stripe'
import { createClient } from '@/lib/supabase/server'

export type CartLineItem = {
  name: string
  description?: string
  priceInCents: number
  quantity: number
  size?: string
}

export async function startCheckoutSession(lineItems: CartLineItem[]) {
  if (!lineItems || lineItems.length === 0) {
    throw new Error('No items provided for checkout')
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: item.priceInCents,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
  })

  if (!session.client_secret) {
    throw new Error('Failed to create checkout session')
  }
  return session.client_secret
}

export async function startCheckoutFromCart() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Please sign in to checkout')
  }

  const { data: cartItems, error } = await supabase
    .from('cart')
    .select(`
      id,
      product_id,
      quantity,
      size,
      price,
      product:products(id, name, price)
    `)
    .eq('user_id', user.id)

  if (error || !cartItems || cartItems.length === 0) {
    throw new Error('Your cart is empty')
  }

  const lineItems: CartLineItem[] = cartItems.map((item: any) => ({
    name: item.product?.name || 'Product',
    priceInCents: Math.round(item.price * 100),
    quantity: item.quantity,
    size: item.size,
  }))

  return startCheckoutSession(lineItems)
}
