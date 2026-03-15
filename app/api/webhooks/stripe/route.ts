import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createOrderFromCart, reduceProductInventory } from '@/lib/orders'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Missing signature or secret', { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    try {
      const supabase = await createClient()

      // Get the user ID from the session metadata or by querying the checkout session
      if (session.client_reference_id) {
        // User was signed in when creating the session
        const order = await createOrderFromCart(session.client_reference_id, session.id)
        
        // Reduce inventory for each item in the order
        if (order && order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            await reduceProductInventory(item.product_id, item.size, item.qty)
          }
        }

        // Update order status to confirmed
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', order.id)
      } else {
        // Try to find the order by stripe_session_id and update it
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id, items')
          .eq('stripe_session_id', session.id)
          .single()

        if (!existingOrder) {
          console.error('No order found for session:', session.id)
          return new Response('Order not found', { status: 404 })
        }

        // Reduce inventory for each item
        if (existingOrder.items && Array.isArray(existingOrder.items)) {
          for (const item of existingOrder.items) {
            await reduceProductInventory(item.product_id, item.size, item.qty)
          }
        }

        // Update order status to confirmed
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', existingOrder.id)
      }
    } catch (err: any) {
      console.error('Error processing webhook:', err.message)
      return new Response(`Webhook error: ${err.message}`, { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
