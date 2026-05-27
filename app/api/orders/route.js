const KV_KEY = 'tenza_orders'

function getKv() {
  if (process.env.KV_REST_API_URL) {
    return import('@vercel/kv').then(m => m.kv)
  }
  return null
}

export async function GET(request) {
  try {
    const kv = await getKv()
    if (!kv) {
      return Response.json({ error: 'Vercel KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN env vars.' }, { status: 503 })
    }
    const orders = (await kv.get(KV_KEY)) || []
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const result = status ? orders.filter(o => o.status === status) : orders
    return Response.json({ orders: result, total: orders.length })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const kv = await getKv()
    if (!kv) {
      return Response.json({ error: 'Vercel KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN env vars.' }, { status: 503 })
    }
    const order = await request.json()
    const entry = {
      ...order,
      id: order.id || 'TENZA-' + Date.now().toString(36).toUpperCase(),
      createdAt: order.createdAt || new Date().toISOString(),
    }
    const orders = (await kv.get(KV_KEY)) || []
    orders.unshift(entry)
    await kv.set(KV_KEY, orders)
    return Response.json({ order: entry, success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const kv = await getKv()
    if (!kv) {
      return Response.json({ error: 'Vercel KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN env vars.' }, { status: 503 })
    }
    const { id, ...updates } = await request.json()
    if (!id) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 })
    }
    const orders = (await kv.get(KV_KEY)) || []
    const idx = orders.findIndex(o => o.id === id || o.orderId === id)
    if (idx === -1) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }
    orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() }
    await kv.set(KV_KEY, orders)
    return Response.json({ order: orders[idx], success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
