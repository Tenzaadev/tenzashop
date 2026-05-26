const STRIPE_API = 'https://api.stripe.com/v1'

async function stripeFetch(path, options = {}) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Stripe not configured')
  const res = await fetch(`${STRIPE_API}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${key}`,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Stripe API error')
  return data
}

export async function GET(req) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')
    if (!sessionId) return Response.json({ error: 'missing session_id' }, { status: 400 })
    const session = await stripeFetch(`/checkout/sessions/${sessionId}`)
    return Response.json({ payment_status: session.payment_status, amount_total: session.amount_total })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const rates = {
  uz: 10000, ru: 90, en: 1, fi: 0.95, sv: 10.5,
}

const stripeCurrencies = {
  uz: 'uzs', ru: 'rub', en: 'usd', fi: 'eur', sv: 'sek',
}

function toStripeAmount(amount, currency) {
  return ['uzs'].includes(currency) ? Math.round(amount) : Math.round(amount * 100)
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { items, currency = 'en', delivery = 'standard', locale } = body
    const rate = rates[currency] || 1
    const sc = stripeCurrencies[currency] || 'usd'

    const params = new URLSearchParams()
    params.set('mode', 'payment')
    params.set('success_url', `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`)
    params.set('cancel_url', `${process.env.NEXT_PUBLIC_BASE_URL}/`)
    params.set('shipping_address_collection[allowed_countries][]', 'FI')
    params.set('phone_number_collection[enabled]', 'true')

    items.forEach((item, i) => {
      const name = typeof item.name === 'string' ? item.name : (item.name?.[locale] || item.name?.en || 'Item')
      const localPrice = item.price * rate
      params.append(`line_items[${i}][price_data][currency]`, sc)
      params.append(`line_items[${i}][price_data][product_data][name]`, name)
      if (item.image) params.append(`line_items[${i}][price_data][product_data][images][]`, item.image)
      params.append(`line_items[${i}][price_data][unit_amount]`, String(toStripeAmount(localPrice, sc)))
      params.append(`line_items[${i}][quantity]`, String(item.quantity))
    })

    if (delivery === 'express') {
      const i = items.length
      const deliveryAmount = 10 * rate
      params.append(`line_items[${i}][price_data][currency]`, sc)
      params.append(`line_items[${i}][price_data][product_data][name]`, 'Express Delivery')
      params.append(`line_items[${i}][price_data][unit_amount]`, String(toStripeAmount(deliveryAmount, sc)))
      params.append(`line_items[${i}][quantity]`, '1')
    }

    const session = await stripeFetch('/checkout/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Stripe error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
