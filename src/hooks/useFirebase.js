'use client'

export function getProducts(callback) {
  try {
    const data = JSON.parse(localStorage.getItem('tenza_products') || '[]')
    callback(data)
  } catch { callback([]) }
  return () => {}
}

export async function addProductToFirebase(product) {
  const data = JSON.parse(localStorage.getItem('tenza_products') || '[]')
  data.unshift({ ...product, id: 'product_' + Date.now() })
  localStorage.setItem('tenza_products', JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('products-updated'))
  return data[0]
}

export async function updateProductInFirebase(id, updates) {
  const data = JSON.parse(localStorage.getItem('tenza_products') || '[]')
  const idx = data.findIndex(p => p.id === id)
  if (idx >= 0) { data[idx] = { ...data[idx], ...updates }; localStorage.setItem('tenza_products', JSON.stringify(data)); window.dispatchEvent(new CustomEvent('products-updated')) }
}

export async function deleteProductFromFirebase(id) {
  let data = JSON.parse(localStorage.getItem('tenza_products') || '[]')
  data = data.filter(p => p.id !== id)
  localStorage.setItem('tenza_products', JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('products-updated'))
}

export function getOrders(callback) {
  try {
    const data = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
    callback(data)
  } catch { callback([]) }
  return () => {}
}

export async function addOrderToFirebase(order) {
  const data = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
  data.unshift({ ...order, id: 'TENZA-' + Date.now().toString(36).toUpperCase() })
  localStorage.setItem('tenza_orders', JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('orders-updated'))
  return data[0]
}

export async function updateOrderInFirebase(id, updates) {
  const data = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
  const idx = data.findIndex(o => o.id === id)
  if (idx >= 0) { data[idx] = { ...data[idx], ...updates }; localStorage.setItem('tenza_orders', JSON.stringify(data)); window.dispatchEvent(new CustomEvent('orders-updated')) }
}

export async function addUserToFirebase(user) {
  const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
  const key = user.login ? 'tenza_user_' + user.login.toLowerCase().trim() : 'user_' + Date.now()
  users[key] = { ...user, id: key, registeredAt: new Date().toISOString() }
  localStorage.setItem('tenza_users', JSON.stringify(users))
  window.dispatchEvent(new CustomEvent('users-updated'))
}

export async function getAllProducts() {
  try { return JSON.parse(localStorage.getItem('tenza_products') || '[]') } catch { return [] }
}

export async function getAllOrders() {
  try { return JSON.parse(localStorage.getItem('tenza_orders') || '[]') } catch { return [] }
}
