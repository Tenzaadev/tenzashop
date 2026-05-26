import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'

export function getProducts(callback) {
  return onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(products)
  })
}

export async function addProductToFirebase(product) {
  return await addDoc(collection(db, 'products'), product)
}

export async function updateProductInFirebase(id, updates) {
  return await updateDoc(doc(db, 'products', id), updates)
}

export async function deleteProductFromFirebase(id) {
  return await deleteDoc(doc(db, 'products', id))
}

export function getOrders(callback) {
  return onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(orders)
  })
}

export async function addOrderToFirebase(order) {
  return await addDoc(collection(db, 'orders'), order)
}

export async function updateOrderInFirebase(id, updates) {
  return await updateDoc(doc(db, 'orders', id), updates)
}

export async function addUserToFirebase(user) {
  return await addDoc(collection(db, 'users'), user)
}

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, 'products'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getAllOrders() {
  const snapshot = await getDocs(collection(db, 'orders'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
