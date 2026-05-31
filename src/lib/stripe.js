let stripeInstance = null

export async function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!stripeInstance) {
    const Stripe = (await import('stripe')).default
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeInstance
}

export async function createCheckoutSession(amount, currency = 'eur', orderId, customerEmail) {
  const stripe = await getStripe()
  if (!stripe) throw new Error('Stripe not configured')

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency,
        product_data: { name: 'TENZA SHOP Order' },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
    customer_email: customerEmail,
    metadata: { orderId },
  })
  return session
}

export async function checkPaymentStatus(sessionId) {
  const stripe = await getStripe()
  if (!stripe) throw new Error('Stripe not configured')

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session.payment_status
}
