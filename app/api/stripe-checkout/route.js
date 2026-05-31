import { NextResponse } from 'next/server'

let stripeInstance = null

async function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!stripeInstance) {
    const Stripe = (await import('stripe')).default
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeInstance
}

export async function POST(request) {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const { items, orderId, customerEmail } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

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

export async function GET(request) {
  try {
    const stripe = await getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({ paid: session.payment_status === 'paid' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
