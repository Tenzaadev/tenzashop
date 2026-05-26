import { db } from './firebase'
import {
  collection, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, where, orderBy, limit, Timestamp, serverTimestamp
} from 'firebase/firestore'

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const collections = {
  products: 'products',
  users: 'users',
  orders: 'orders',
  reviews: 'reviews',
  notifications: 'notifications',
  support: 'support',
}

export const generateLoginKey = (login) => 'tenza_user_' + login.toLowerCase().trim()
export const generateReferralCode = () => 'TENZA-' + Math.random().toString(36).substring(2, 8).toUpperCase()

/* ------------------------------------------------------------------ */
/*  PRODUCTS                                                           */
/* ------------------------------------------------------------------ */
export function subscribeProducts(callback) {
  return onSnapshot(
    query(collection(db, collections.products), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ ...d.data(), _docId: d.id })))
  )
}

export function subscribeProductsByCategory(category, callback) {
  const q = category && category !== 'all'
    ? query(collection(db, collections.products), where('category', '==', category), orderBy('createdAt', 'desc'))
    : query(collection(db, collections.products), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => ({ ...d.data(), _docId: d.id }))))
}

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, collections.products))
  return snapshot.docs.map(d => ({ ...d.data(), _docId: d.id }))
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, collections.products, id))
  return snap.exists() ? { ...snap.data(), _docId: snap.id } : null
}

export async function addProduct(product) {
  const docId = product.id || `product_${Date.now()}`
  await setDoc(doc(db, collections.products, docId), { ...product, id: docId, createdAt: serverTimestamp() })
  return { ...product, id: docId }
}

export async function updateProduct(id, updates) {
  await updateDoc(doc(db, collections.products, id), { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, collections.products, id))
}

export async function updateProductStock(id, stock) {
  await updateDoc(doc(db, collections.products, id), { stock: Math.max(0, stock) })
}

export async function seedProducts(products) {
  const existing = await getAllProducts()
  if (existing.length > 0) return { skipped: true, count: existing.length }
  let count = 0
  for (const p of products) {
    const docId = p.id || `product_${Date.now()}_${count}`
    await setDoc(doc(db, collections.products, docId), { ...p, id: docId, createdAt: serverTimestamp() })
    count++
  }
  return { seeded: true, count }
}

/* ------------------------------------------------------------------ */
/*  USERS                                                              */
/* ------------------------------------------------------------------ */
export function subscribeAllUsers(callback) {
  return onSnapshot(
    query(collection(db, collections.users), orderBy('registeredAt', 'desc')),
    (snapshot) => {
      const users = {}
      snapshot.docs.forEach(d => { users[d.id] = { id: d.id, ...d.data() } })
      callback(users)
    }
  )
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, collections.users))
  const users = {}
  snapshot.docs.forEach(d => { users[d.id] = { id: d.id, ...d.data() } })
  return users
}

export async function getUserDoc(key) {
  const snap = await getDoc(doc(db, collections.users, key))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function setUser(key, userData) {
  const data = { ...userData, updatedAt: serverTimestamp() }
  if (!userData.registeredAt) data.registeredAt = serverTimestamp()
  await setDoc(doc(db, collections.users, key), data, { merge: true })
}

export async function updateUser(key, updates) {
  await updateDoc(doc(db, collections.users, key), { ...updates, updatedAt: serverTimestamp() })
}

export async function isLoginTaken(login) {
  const key = generateLoginKey(login.trim())
  const snap = await getDoc(doc(db, collections.users, key))
  return snap.exists()
}

export async function findUserByReferralCode(code) {
  const snapshot = await getDocs(
    query(collection(db, collections.users), where('referralCode', '==', code), limit(1))
  )
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

export async function addPurchaseBonus(login, amountUSD) {
  const key = generateLoginKey(login)
  const snap = await getDoc(doc(db, collections.users, key))
  if (!snap.exists()) return
  const user = snap.data()
  const coinsToAdd = Math.floor(amountUSD)
  if (coinsToAdd <= 0) return
  const purchases = user.purchases || []
  purchases.push({ date: new Date().toISOString(), amount: amountUSD, bonus: coinsToAdd })
  await updateDoc(doc(db, collections.users, key), {
    coins: (user.coins || 0) + coinsToAdd,
    totalPurchases: (user.totalPurchases || 0) + 1,
    totalSpent: (user.totalSpent || 0) + amountUSD,
    purchases,
    updatedAt: serverTimestamp(),
  })
}

export async function getUserStats() {
  const snapshot = await getDocs(collection(db, collections.users))
  const vals = snapshot.docs.map(d => d.data())
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
  return onSnapshot(
    query(collection(db, collections.orders), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getAllOrders() {
  const snapshot = await getDocs(
    query(collection(db, collections.orders), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addOrder(order) {
  const ref = await addDoc(collection(db, collections.orders), { ...order, createdAt: serverTimestamp() })
  return { id: ref.id, ...order }
}

export async function updateOrder(id, updates) {
  await updateDoc(doc(db, collections.orders, id), { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, collections.orders, id))
}

export async function getUserOrders(login, callback) {
  if (!callback) {
    const snapshot = await getDocs(
      query(collection(db, collections.orders), where('login', '==', login), orderBy('createdAt', 'desc'))
    )
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  }
  return onSnapshot(
    query(collection(db, collections.orders), where('login', '==', login), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                            */
/* ------------------------------------------------------------------ */
export function subscribeReviews(callback) {
  return onSnapshot(
    query(collection(db, collections.reviews), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export function subscribeProductReviews(productId, callback) {
  return onSnapshot(
    query(collection(db, collections.reviews), where('productId', '==', productId), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getAllReviews() {
  const snapshot = await getDocs(
    query(collection(db, collections.reviews), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addReview(review) {
  const ref = await addDoc(collection(db, collections.reviews), { ...review, createdAt: serverTimestamp() })
  return { id: ref.id, ...review }
}

/* ------------------------------------------------------------------ */
/*  NOTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */
export function subscribeNotifications(callback) {
  return onSnapshot(
    query(collection(db, collections.notifications), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getAllNotifications() {
  const snapshot = await getDocs(
    query(collection(db, collections.notifications), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addNotification(notification) {
  const ref = await addDoc(collection(db, collections.notifications), { ...notification, createdAt: serverTimestamp() })
  return { id: ref.id, ...notification }
}

export async function markNotificationRead(id) {
  await updateDoc(doc(db, collections.notifications, id), { read: true })
}

/* ------------------------------------------------------------------ */
/*  SUPPORT MESSAGES                                                   */
/* ------------------------------------------------------------------ */
export function subscribeSupportMessages(callback) {
  return onSnapshot(
    query(collection(db, collections.support), orderBy('createdAt', 'desc')),
    (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getAllSupportMessages() {
  const snapshot = await getDocs(
    query(collection(db, collections.support), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addSupportMessage(msg) {
  const ref = await addDoc(collection(db, collections.support), { ...msg, createdAt: serverTimestamp() })
  return { id: ref.id, ...msg }
}

export async function markSupportReplied(id) {
  await updateDoc(doc(db, collections.support, id), { replied: true, updatedAt: serverTimestamp() })
}
