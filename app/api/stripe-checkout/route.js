import { NextResponse } from 'next/server'

function getStripe() {
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request) {
  try {
    const { items, orderId, customerEmail } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `TENZA - ${item.name || 'Product'}`,
            ...(item.image?.startsWith('http') ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart`,
      customer_email: customerEmail,
      metadata: { orderId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
