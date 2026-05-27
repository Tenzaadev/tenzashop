'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { setUser as setUserDoc, updateUser, getUserDoc, subscribeAllUsers, isLoginTaken, findUserByReferralCode, getUserStats, generateReferralCode, generateLoginKey } from '@/lib/firestore'

export const AuthContext = createContext(null)

const LS_USERS_KEY = 'tenza_users'

function loadLocalUsers() {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(LS_USERS_KEY) || '{}') } catch { return {} }
}

function saveLocalUsers(users) {
  try { localStorage.setItem(LS_USERS_KEY, JSON.stringify(users)) } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedSession = localStorage.getItem('tenza_current_user')
    if (savedSession) {
      try { setUser(JSON.parse(savedSession)) } catch {}
    }

    setAllUsers(loadLocalUsers())

    const unsub = subscribeAllUsers((users) => {
      setAllUsers(users)
      saveLocalUsers(users)
    })
    return () => unsub()
  }, [])

  const register = async (login, password, referredByCode = null) => {
    if (!login || !password) return { success: false, error: 'Login va parol kiritish majburiy' }
    if (login.trim().length < 3) return { success: false, error: 'Login kamida 3 belgi bolishi kerak' }
    if (password.length < 4) return { success: false, error: 'Parol kamida 4 belgi bolishi kerak' }

    const key = generateLoginKey(login)
    if (allUsers[key]) return { success: false, error: 'Bu login allaqachon ishlatilgan' }
    try {
      if (await isLoginTaken(login)) return { success: false, error: 'Bu login allaqachon ishlatilgan' }
    } catch {}

    const newReferralCode = generateReferralCode()
    const now = new Date().toISOString()

    let bonus = 0
    let referrerBonus = 0
    let referrerId = null

    if (referredByCode) {
      try {
        const referrer = await findUserByReferralCode(referredByCode)
        if (referrer && referrer.id !== key) {
          referrerId = referrer.id
          referrerBonus = 25
          await updateUser(referrerId, {
            coins: (referrer.coins || 0) + 25,
            referralCount: (referrer.referralCount || 0) + 1,
            referralBonus: (referrer.referralBonus || 0) + 25,
          }).catch(() => {})
          bonus = 25
        }
      } catch {
        const local = loadLocalUsers()
        const refFound = Object.values(local).find(u => u.referralCode === referredByCode)
        if (refFound && refFound.login !== login) {
          referrerId = key
          const refUserKey = generateLoginKey(refFound.login)
          const refUser = { ...refFound, coins: (refFound.coins || 0) + 25, referralCount: (refFound.referralCount || 0) + 1, referralBonus: (refFound.referralBonus || 0) + 25 }
          local[refUserKey] = refUser
          saveLocalUsers(local)
          bonus = 25
        }
      }
    }

    const newUser = {
      login, password,
      referralCode: newReferralCode,
      registeredAt: now,
      referredBy: referrerId ? allUsers[referrerId]?.login : null,
      coins: bonus, referralCount: 0, referralBonus: referrerBonus,
      totalPurchases: 0, totalSpent: 0, purchases: [],
    }

    try {
      await setUserDoc(key, newUser)
    } catch {}
    const local = loadLocalUsers()
    local[key] = newUser
    saveLocalUsers(local)

    setAllUsers(prev => ({ ...prev, [key]: newUser }))
    setUser(newUser)
    localStorage.setItem('tenza_current_user', JSON.stringify(newUser))
    return { success: true, user: { ...newUser, key } }
  }

  const login = async (login, password) => {
    const key = generateLoginKey(login.trim())
    let existingUser = allUsers[key]

    if (!existingUser) {
      try {
        existingUser = await getUserDoc(key)
      } catch {
        const local = loadLocalUsers()
        existingUser = local[key]
      }
    }

    if (!existingUser) return { success: false, error: 'USER_NOT_FOUND' }
    if (existingUser.password !== password) return { success: false, error: 'WRONG_PASSWORD' }

    setUser(existingUser)
    localStorage.setItem('tenza_current_user', JSON.stringify(existingUser))
    return { success: true, user: existingUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tenza_current_user')
  }

  const addPurchaseBonus = async (amountUSD) => {
    if (!user) return
    const coinsToAdd = Math.floor(amountUSD)
    if (coinsToAdd <= 0) return
    const key = generateLoginKey(user.login)
    const purchases = [...(user.purchases || []), { date: new Date().toISOString(), amount: amountUSD, bonus: coinsToAdd }]
    const updates = {
      coins: (user.coins || 0) + coinsToAdd,
      totalPurchases: (user.totalPurchases || 0) + 1,
      totalSpent: (user.totalSpent || 0) + amountUSD,
      purchases,
    }
    const updatedUser = { ...user, ...updates }
    try {
      await updateUser(key, updates)
    } catch {
      const local = loadLocalUsers()
      local[key] = { ...local[key], ...updates }
      saveLocalUsers(local)
    }
    setUser(updatedUser)
    localStorage.setItem('tenza_current_user', JSON.stringify(updatedUser))
  }

  const getUserByReferralCode = async (code) => {
    if (allUsers) {
      const found = Object.values(allUsers).find(u => u.referralCode === code)
      if (found) return found
    }
    try { return await findUserByReferralCode(code) } catch { return null }
  }

  const getStats = async () => {
    try { return await getUserStats() } catch { return { totalUsers: 0, totalCoins: 0, totalPurchases: 0 } }
  }

  const checkLoginTaken = async (login) => {
    const key = generateLoginKey(login.trim())
    if (allUsers[key]) return true
    try { return await isLoginTaken(login) } catch { return false }
  }

  return (
    <AuthContext.Provider value={{
      user, allUsers, mounted,
      register, login, logout,
      addPurchaseBonus,
      getUserByReferralCode, getStats,
      isLoginTaken: checkLoginTaken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
