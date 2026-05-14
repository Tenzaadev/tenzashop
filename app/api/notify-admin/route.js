import { notifyAdminNewOrder, notifyClientOrderConfirmed, notifyClientOrderCancelled } from '@/lib/telegram'

export async function POST(request) {
  const body = await request.json()
  const { action, order } = body

  try {
    if (action === 'new_order') {
      await notifyAdminNewOrder(order)
    } else if (action === 'confirmed') {
      await notifyClientOrderConfirmed(order)
    } else if (action === 'cancelled') {
      await notifyClientOrderCancelled(order)
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
