import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return Response.json({ error: 'missing session_id' }, { status: 400 })
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return Response.json({ payment_status: session.payment_status, amount_total: session.amount_total })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const rates = {
  uz: 10000,
  ru: 90,
  en: 1,
  fi: 0.95,
  sv: 10.5,
}

const stripeCurrencies = {
  uz: 'uzs',
  ru: 'rub',
  en: 'usd',
  fi: 'eur',
  sv: 'sek',
}

const zeroDecimal = ['uzs']

function toStripeAmount(amount, currency) {
  return zeroDecimal.includes(currency) ? Math.round(amount) : Math.round(amount * 100)
}

export async function POST(req) {
  try {
    const { items, currency = 'en', delivery = 'standard', locale } = await req.json()
    const rate = rates[currency] || 1
    const stripeCurrency = stripeCurrencies[currency] || 'usd'

    const lineItems = items.map(item => {
      const name = typeof item.name === 'string' ? item.name : (item.name?.[locale] || item.name?.en || 'Item')
      const localPrice = item.price * rate
      return {
        price_data: {
          currency: stripeCurrency,
          product_data: { name, images: item.image ? [item.image] : [] },
          unit_amount: toStripeAmount(localPrice, stripeCurrency),
        },
        quantity: item.quantity,
      }
    })

    if (delivery === 'express') {
      const deliveryAmount = 10 * rate
      lineItems.push({
        price_data: {
          currency: stripeCurrency,
          product_data: { name: 'Express Delivery' },
          unit_amount: toStripeAmount(deliveryAmount, stripeCurrency),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      shipping_address_collection: { allowed_countries: ['FI'] },
      phone_number_collection: { enabled: true },
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Stripe error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
