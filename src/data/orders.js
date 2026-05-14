const ORDERS_KEY = 'tenza_orders'

export function calculateLoyaltyBonus(orderTotal) {
  if (orderTotal >= 500) return 1000
  if (orderTotal >= 200) return 300
  if (orderTotal >= 100) return 100
  if (orderTotal >= 50) return 25
  return 0
}

export function getOrders() {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ORDERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveOrder(orderData) {
  const orders = getOrders()
  const order = {
    ...orderData,
    id: 'TENZA-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    coinsEarned: 0,
  }
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return order
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders()
  const index = orders.findIndex(o => o.orderId === orderId || o.id === orderId)
  if (index >= 0) {
    orders[index].status = newStatus
    orders[index].updatedAt = new Date().toISOString()
    if (newStatus === 'paid') {
      orders[index].coinsEarned = Math.floor(orders[index].total || orders[index].totalPrice || 0)
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    return orders[index]
  }
  return null
}

export function getPendingOrders() {
  return getOrders().filter(o => o.status === 'pending_verification')
}

export function getOrderById(orderId) {
  return getOrders().find(o => o.orderId === orderId || o.id === orderId) || null
}
