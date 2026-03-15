'use server'

import { createClient } from '@/lib/supabase/server'

export async function generateTrackingNumber(): Promise<string> {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `KB-${timestamp}-${random}`
}

export async function generateOrderNumber(): Promise<string> {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0')
  return `ORD-${dateStr}-${random}`
}

export async function createOrderFromCart(userId: string, stripeSessionId: string) {
  const supabase = await createClient()

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart')
    .select('product_id, quantity, size, price')
    .eq('user_id', userId)

  if (cartError || !cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Create order
  const orderNumber = await generateOrderNumber()
  const trackingNumber = await generateTrackingNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      tracking_number: trackingNumber,
      status: 'pending',
      total_amount: total,
      stripe_session_id: stripeSessionId,
      items: cartItems,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

  // Clear cart
  await supabase.from('cart').delete().eq('user_id', userId)

  return order
}

export async function reduceProductInventory(productId: string, size: string | null, quantity: number) {
  if (!size) return

  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('size_inventory')
    .eq('id', productId)
    .single()

  if (!product) return

  const inventory = (product.size_inventory || {}) as Record<string, number>
  const currentQty = inventory[size] || 0
  const newQty = Math.max(0, currentQty - quantity)

  const updatedInventory = { ...inventory, [size]: newQty }

  await supabase
    .from('products')
    .update({ size_inventory: updatedInventory })
    .eq('id', productId)
}
