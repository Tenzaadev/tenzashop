'use client'
import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

const generateReferralCode = () => {
  return 'TENZA-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

const generateLoginKey = (login) => {
  return 'tenza_user_' + login.toLowerCase().trim()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem('tenza_users')
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers))
    }
    const savedSession = localStorage.getItem('tenza_current_user')
    if (savedSession) {
      setUser(JSON.parse(savedSession))
    }
  }, [])

  const saveUsers = (users) => {
    setAllUsers(users)
    localStorage.setItem('tenza_users', JSON.stringify(users))
  }

  const isLoginTaken = (login) => {
    const key = generateLoginKey(login.trim())
    return !!allUsers[key]
  }

  const register = (login, password, referredByCode = null) => {
    if (!login || !password) return { success: false, error: 'Login va parol kiritish majburiy' }
    if (login.trim().length < 3) return { success: false, error: 'Login kamida 3 belgi bolishi kerak' }
    if (password.length < 4) {
      return { success: false, error: 'Parol kamida 4 belgi bolishi kerak' }
    }
    if (isLoginTaken(login)) {
      return { success: false, error: 'Bu login allaqachon ishlatilgan' }
    }

    const key = generateLoginKey(login)
    const newReferralCode = generateReferralCode()
    const now = new Date().toISOString()
    
    let bonus = 0
    let referrerBonus = 0
    let referrerId = null

    if (referredByCode) {
      referrerId = Object.keys(allUsers).find(k => allUsers[k]?.referralCode === referredByCode)
      if (referrerId && referrerId !== key) {
        referrerBonus = 25
        allUsers[referrerId] = {
          ...allUsers[referrerId],
          coins: (allUsers[referrerId].coins || 0) + 25,
          referralCount: (allUsers[referrerId].referralCount || 0) + 1,
          referralBonus: (allUsers[referrerId].referralBonus || 0) + 25
        }
        bonus = 25
      }
    }

    const newUser = {
      login,
      password,
      referralCode: newReferralCode,
      registeredAt: now,
      referredBy: referrerId ? allUsers[referrerId]?.login : null,
      coins: bonus,
      referralCount: 0,
      referralBonus: referrerBonus,
      totalPurchases: 0,
      totalSpent: 0,
      purchases: []
    }

    const updatedUsers = { ...allUsers, [key]: newUser }
    saveUsers(updatedUsers)
    setUser(newUser)
    localStorage.setItem('tenza_current_user', JSON.stringify(newUser))

    return { success: true, user: { ...newUser, key } }
  }

  const login = (login, password) => {
    const key = generateLoginKey(login.trim())
    const existingUser = allUsers[key]
    
    if (!existingUser) {
      return { success: false, error: 'Foydalanuvchi topilmadi' }
    }
    if (existingUser.password !== password) {
      return { success: false, error: 'Parol notogri' }
    }

    setUser(existingUser)
    localStorage.setItem('tenza_current_user', JSON.stringify(existingUser))
    return { success: true, user: existingUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tenza_current_user')
  }

  const addPurchaseBonus = (amountUSD) => {
    if (!user) return
    const coinsToAdd = Math.floor(amountUSD)
    if (coinsToAdd > 0) {
      const key = generateLoginKey(user.login)
      const updatedUser = {
        ...user,
        coins: (user.coins || 0) + coinsToAdd,
        totalPurchases: (user.totalPurchases || 0) + 1,
        totalSpent: (user.totalSpent || 0) + amountUSD,
        purchases: [...(user.purchases || []), { date: new Date().toISOString(), amount: amountUSD, bonus: coinsToAdd }]
      }
      allUsers[key] = updatedUser
      saveUsers(allUsers)
      setUser(updatedUser)
      localStorage.setItem('tenza_current_user', JSON.stringify(updatedUser))
    }
  }

  const getUserByReferralCode = (code) => {
    return Object.values(allUsers).find(u => u.referralCode === code)
  }

  const getStats = () => {
    return {
      totalUsers: Object.keys(allUsers).length,
      totalCoins: Object.values(allUsers).reduce((sum, u) => sum + (u.coins || 0), 0),
      totalPurchases: Object.values(allUsers).reduce((sum, u) => sum + (u.totalPurchases || 0), 0)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      allUsers,
      mounted,
      register,
      login,
      logout,
      addPurchaseBonus,
      getUserByReferralCode,
      getStats,
      isLoginTaken
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