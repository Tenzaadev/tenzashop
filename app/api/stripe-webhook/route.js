import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const sig = request.headers.get('stripe-signature')
    const rawBody = await request.text()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (webhookSecret && sig) {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      let event
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
      } catch {
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          await fetch(`${baseUrl}/api/orders`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: orderId,
              status: 'paid',
              paidAt: new Date().toISOString(),
              paymentIntentId: session.payment_intent,
            }),
          }).catch(() => {})
        }
      }

      if (event.type === 'checkout.session.expired') {
        const session = event.data.object
        const orderId = session.metadata?.orderId
        if (orderId) {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          await fetch(`${baseUrl}/api/orders`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orderId, status: 'expired' }),
          }).catch(() => {})
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
