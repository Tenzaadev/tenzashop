'use server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession(cartItems, customerInfo) {
  if (!cartItems || cartItems.length === 0) {
    return { error: 'Cart is empty' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.size ? `Size: ${item.size}` : undefined,
        images: item.image ? [item.image] : undefined,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || 1,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    customer_email: customerInfo?.email,
    metadata: {
      customerName: customerInfo?.name || '',
      customerPhone: customerInfo?.phone || '',
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'UZ', 'RU', 'FI', 'SE', 'GB', 'DE', 'FR'],
    },
    billing_address_collection: 'required',
  })

  return { sessionId: session.id, url: session.url }
}

export async function getCheckoutSession(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return { session }
  } catch (error) {
    return { error: error.message }
  }
}