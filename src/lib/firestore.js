'use client'

const LS_PRODUCTS = 'tenza_products'
const LS_ORDERS = 'tenza_orders'
const LS_USERS = 'tenza_users'
const LS_REVIEWS = 'tenza_reviews'
const LS_NOTIFICATIONS = 'tenza_notifications'
const LS_SUPPORT = 'tenza_support'

function lsGet(key) {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
function lsSet(key, val) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function subscribeTo(lsKey, eventName, transform, callback) {
  if (typeof window !== 'undefined') {
    const fire = () => {
      const data = lsGet(lsKey)
      callback(data ? (transform ? transform(data) : data) : [])
    }
    fire()
    window.addEventListener(eventName, fire)
    return () => window.removeEventListener(eventName, fire)
  }
  return () => {}
}

function flattenNotifs(obj) {
  if (!obj || typeof obj !== 'object') return []
  const arr = []
  Object.keys(obj).forEach(email => {
    ;(obj[email] || []).forEach(n => {
      arr.push({ ...n, email: n.email || email })
    })
  })
  return arr
}

export const generateLoginKey = (login) => 'tenza_user_' + login.toLowerCase().trim()
export const generateReferralCode = () => 'TENZA-' + Math.random().toString(36).substring(2, 8).toUpperCase()

/* ------------------------------------------------------------------ */
/*  PRODUCTS                                                           */
/* ------------------------------------------------------------------ */
export function subscribeProducts(callback) {
  return subscribeTo(LS_PRODUCTS, 'products-updated', null, callback)
}

export function subscribeProductsByCategory(category, callback) {
  return subscribeTo(LS_PRODUCTS, 'products-updated', (data) => {
    if (category && category !== 'all') return data.filter(p => p.category === category || (category === 'limited' && p.isLimited))
    return data
  }, callback)
}

export async function getAllProducts() {
  return lsGet(LS_PRODUCTS) || []
}

export async function getProductById(id) {
  const products = lsGet(LS_PRODUCTS) || []
  return products.find(p => p.id === id || p._docId === id) || null
}

export async function addProduct(product) {
  const products = lsGet(LS_PRODUCTS) || []
  const docId = product.id || 'product_' + Date.now()
  const entry = { ...product, id: docId, _docId: docId, createdAt: new Date().toISOString() }
  products.unshift(entry)
  lsSet(LS_PRODUCTS, products)
  window.dispatchEvent(new CustomEvent('products-updated'))
  return entry
}

export async function updateProduct(id, updates) {
  const products = lsGet(LS_PRODUCTS) || []
  const idx = products.findIndex(p => p.id === id || p._docId === id)
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() }
    lsSet(LS_PRODUCTS, products)
    window.dispatchEvent(new CustomEvent('products-updated'))
  }
}

export async function deleteProduct(id) {
  let products = lsGet(LS_PRODUCTS) || []
  products = products.filter(p => p.id !== id && p._docId !== id)
  lsSet(LS_PRODUCTS, products)
  window.dispatchEvent(new CustomEvent('products-updated'))
}

export async function updateProductStock(id, stock) {
  await updateProduct(id, { stock: Math.max(0, stock) })
}

export async function seedProducts(products) {
  const existing = lsGet(LS_PRODUCTS) || []
  if (existing.length > 0) return { skipped: true, count: existing.length }
  const entries = products.map((p, i) => ({
    ...p, _docId: p.id || 'product_' + Date.now() + '_' + i,
    createdAt: new Date().toISOString()
  }))
  lsSet(LS_PRODUCTS, entries)
  window.dispatchEvent(new CustomEvent('products-updated'))
  return { seeded: true, count: entries.length }
}

/* ------------------------------------------------------------------ */
/*  USERS                                                              */
/* ------------------------------------------------------------------ */
export function subscribeAllUsers(callback) {
  return subscribeTo(LS_USERS, 'users-updated', null, callback)
}

export async function getAllUsers() {
  return lsGet(LS_USERS) || {}
}

export async function getUserDoc(key) {
  const users = lsGet(LS_USERS) || {}
  return users[key] ? { id: key, ...users[key] } : null
}

export async function setUser(key, userData) {
  const users = lsGet(LS_USERS) || {}
  const data = { ...userData, updatedAt: new Date().toISOString() }
  if (!userData.registeredAt) data.registeredAt = new Date().toISOString()
  users[key] = data
  lsSet(LS_USERS, users)
  window.dispatchEvent(new CustomEvent('users-updated'))
}

export async function updateUser(key, updates) {
  const users = lsGet(LS_USERS) || {}
  if (users[key]) {
    users[key] = { ...users[key], ...updates, updatedAt: new Date().toISOString() }
    lsSet(LS_USERS, users)
    window.dispatchEvent(new CustomEvent('users-updated'))
  }
}

export async function isLoginTaken(login) {
  const key = generateLoginKey(login.trim())
  const users = lsGet(LS_USERS) || {}
  return !!users[key]
}

export async function findUserByReferralCode(code) {
  const users = lsGet(LS_USERS) || {}
  const match = Object.keys(users).find(k => users[k].referralCode === code)
  return match ? { id: match, ...users[match] } : null
}

export async function addPurchaseBonus(login, amountUSD) {
  const key = generateLoginKey(login)
  const users = lsGet(LS_USERS) || {}
  if (!users[key]) return
  const user = users[key]
  const coinsToAdd = Math.floor(amountUSD)
  if (coinsToAdd <= 0) return
  const purchases = user.purchases || []
  purchases.push({ date: new Date().toISOString(), amount: amountUSD, bonus: coinsToAdd })
  users[key] = {
    ...user,
    coins: (user.coins || 0) + coinsToAdd,
    totalPurchases: (user.totalPurchases || 0) + 1,
    totalSpent: (user.totalSpent || 0) + amountUSD,
    purchases,
    updatedAt: new Date().toISOString(),
  }
  lsSet(LS_USERS, users)
  window.dispatchEvent(new CustomEvent('users-updated'))
}

export async function getUserStats() {
  const users = lsGet(LS_USERS) || {}
  const vals = Object.values(users)
  return {
    totalUsers: vals.length,
    totalCoins: vals.reduce((s, u) => s + (u.coins || 0), 0),
    totalPurchases: vals.reduce((s, u) => s + (u.totalPurchases || 0), 0),
  }
}

/* ------------------------------------------------------------------ */
/*  ORDERS                                                             */
/* ------------------------------------------------------------------ */
export function subscribeOrders(callback) {
  return subscribeTo(LS_ORDERS, 'orders-updated', null, callback)
}

export async function getAllOrders() {
  return lsGet(LS_ORDERS) || []
}

export async function addOrder(order) {
  const orders = lsGet(LS_ORDERS) || []
  const entry = { ...order, id: order.id || 'TENZA-' + Date.now().toString(36).toUpperCase(), createdAt: order.createdAt || new Date().toISOString() }
  orders.unshift(entry)
  lsSet(LS_ORDERS, orders)
  window.dispatchEvent(new CustomEvent('orders-updated'))
  return entry
}

export async function updateOrder(id, updates) {
  const orders = lsGet(LS_ORDERS) || []
  const idx = orders.findIndex(o => o.id === id || o.orderId === id)
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() }
    lsSet(LS_ORDERS, orders)
    window.dispatchEvent(new CustomEvent('orders-updated'))
  }
}

export async function deleteOrder(id) {
  let orders = lsGet(LS_ORDERS) || []
  orders = orders.filter(o => o.id !== id && o.orderId !== id)
  lsSet(LS_ORDERS, orders)
  window.dispatchEvent(new CustomEvent('orders-updated'))
}

export async function getUserOrders(login, callback) {
  const all = lsGet(LS_ORDERS) || []
  const userOrders = all.filter(o => o.login === login || o.email === login)
  if (callback) {
    callback(userOrders)
    return () => {}
  }
  return userOrders
}

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                            */
/* ------------------------------------------------------------------ */
export function subscribeReviews(callback) {
  return subscribeTo(LS_REVIEWS, 'reviews-updated', null, callback)
}

export function subscribeProductReviews(productId, callback) {
  return subscribeTo(LS_REVIEWS, 'reviews-updated', (data) => {
    return (data || []).filter(r => r.productId === productId)
  }, callback)
}

export async function getAllReviews() {
  return lsGet(LS_REVIEWS) || []
}

export async function addReview(review) {
  const reviews = lsGet(LS_REVIEWS) || []
  const entry = { ...review, id: 'REVIEW-' + Date.now().toString(36), createdAt: new Date().toISOString() }
  reviews.unshift(entry)
  lsSet(LS_REVIEWS, reviews)
  window.dispatchEvent(new CustomEvent('reviews-updated'))
  return entry
}

/* ------------------------------------------------------------------ */
/*  NOTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */
export function subscribeNotifications(callback) {
  const unsub1 = subscribeTo(LS_NOTIFICATIONS, 'notifications-updated', flattenNotifs, callback)
  const unsub2 = subscribeTo(LS_NOTIFICATIONS, 'notification-added', flattenNotifs, callback)
  return () => { unsub1(); unsub2() }
}

export async function getAllNotifications() {
  return flattenNotifs(lsGet(LS_NOTIFICATIONS))
}

export async function addNotification(notification) {
  const notifs = lsGet(LS_NOTIFICATIONS) || {}
  const email = notification.email
  if (!email) return null
  if (!notifs[email]) notifs[email] = []
  const entry = { id: 'NOTIF-' + Date.now().toString(36), ...notification, createdAt: new Date().toISOString(), read: false }
  notifs[email].unshift(entry)
  lsSet(LS_NOTIFICATIONS, notifs)
  window.dispatchEvent(new CustomEvent('notifications-updated'))
  window.dispatchEvent(new CustomEvent('notification-added'))
  return entry
}

export async function markNotificationRead(id) {
  const notifs = lsGet(LS_NOTIFICATIONS) || {}
  Object.keys(notifs).forEach(email => {
    const arr = notifs[email] || []
    const idx = arr.findIndex(n => n.id === id)
    if (idx >= 0) {
      arr[idx].read = true
      notifs[email] = arr
    }
  })
  lsSet(LS_NOTIFICATIONS, notifs)
  window.dispatchEvent(new CustomEvent('notifications-updated'))
}

/* ------------------------------------------------------------------ */
/*  SUPPORT MESSAGES                                                   */
/* ------------------------------------------------------------------ */
export function subscribeSupportMessages(callback) {
  const unsub1 = subscribeTo(LS_SUPPORT, 'support-updated', null, callback)
  const unsub2 = subscribeTo(LS_SUPPORT, 'support-message-updated', null, callback)
  return () => { unsub1(); unsub2() }
}

export async function getAllSupportMessages() {
  return lsGet(LS_SUPPORT) || []
}

export async function addSupportMessage(msg) {
  const messages = lsGet(LS_SUPPORT) || []
  const entry = { ...msg, id: 'SUPPORT-' + Date.now().toString(36), createdAt: new Date().toISOString(), status: 'pending', replies: [] }
  messages.unshift(entry)
  lsSet(LS_SUPPORT, messages)
  window.dispatchEvent(new CustomEvent('support-updated'))
  window.dispatchEvent(new CustomEvent('support-message-updated'))
  return entry
}

export async function markSupportReplied(id) {
  const messages = lsGet(LS_SUPPORT) || []
  const idx = messages.findIndex(m => m.id === id)
  if (idx >= 0) {
    messages[idx].replied = true
    messages[idx].updatedAt = new Date().toISOString()
    lsSet(LS_SUPPORT, messages)
    window.dispatchEvent(new CustomEvent('support-updated'))
    window.dispatchEvent(new CustomEvent('support-message-updated'))
  }
}
