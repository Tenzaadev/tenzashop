import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

let app = null
let dbInstance = null

function initFirebase() {
  if (dbInstance) return dbInstance
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    const hasAllKeys = Object.values(firebaseConfig).every(v => v && typeof v === 'string')
    if (!hasAllKeys) return null
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
    dbInstance = getFirestore(app)
    return dbInstance
  } catch {
    return null
  }
}

const db = initFirebase()

export function getDb() {
  return db || initFirebase()
}

export { db }