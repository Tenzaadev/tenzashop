'use client'

function findUser(emailOrLogin) {
  if (!emailOrLogin) return null
  const key = emailOrLogin.toLowerCase().trim()

  try {
    const raw = localStorage.getItem('tenza_users')
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) {
        const found = data.find(u => u?.email?.toLowerCase() === key || u?.login?.toLowerCase() === key)
        if (found) return found
      } else {
        const match = Object.keys(data).find(k => data[k]?.email?.toLowerCase() === key || data[k]?.login?.toLowerCase() === key)
        if (match) return data[match]
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('tenza_current_user')
    if (raw) {
      const u = JSON.parse(raw)
      if (u?.login?.toLowerCase() === key || u?.email?.toLowerCase() === key) return u
    }
  } catch {}

  try {
    const raw = localStorage.getItem('tenza_user')
    if (raw) {
      const u = JSON.parse(raw)
      if (u?.email?.toLowerCase() === key || u?.name?.toLowerCase() === key) return u
    }
  } catch {}

  try {
    const saved = localStorage.getItem('tenza_user_email')
    if (saved && saved.toLowerCase().trim() !== key) {
      const raw = localStorage.getItem('tenza_users')
      if (raw) {
        const data = JSON.parse(raw)
        const sk = saved.toLowerCase().trim()
        if (Array.isArray(data)) {
          const found = data.find(u => u?.email?.toLowerCase() === sk || u?.login?.toLowerCase() === sk)
          if (found) return found
        } else {
          const match = Object.keys(data).find(k => data[k]?.email?.toLowerCase() === sk || data[k]?.login?.toLowerCase() === sk)
          if (match) return data[match]
        }
      }
    }
  } catch {}

  return null
}

function saveUserCoins(emailOrLogin, newCoins) {
  const key = (emailOrLogin || '').toLowerCase().trim()
  if (!key) return

  try {
    const raw = localStorage.getItem('tenza_users')
    if (raw) {
      const data = JSON.parse(raw)
      let changed = false
      if (Array.isArray(data)) {
        const idx = data.findIndex(u => u?.email?.toLowerCase() === key || u?.login?.toLowerCase() === key)
        if (idx >= 0) { data[idx].coins = newCoins; changed = true }
      } else {
        const match = Object.keys(data).find(k => data[k]?.email?.toLowerCase() === key || data[k]?.login?.toLowerCase() === key)
        if (match) { data[match].coins = newCoins; changed = true }
      }
      if (changed) localStorage.setItem('tenza_users', JSON.stringify(data))
    }
  } catch {}

  try {
    const u = JSON.parse(localStorage.getItem('tenza_user') || 'null')
    if (u && (u.email?.toLowerCase() === key || u.name?.toLowerCase() === key)) {
      u.coins = newCoins
      localStorage.setItem('tenza_user', JSON.stringify(u))
    }
  } catch {}

  try {
    const u = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
    if (u && (u.login?.toLowerCase() === key || u.email?.toLowerCase() === key)) {
      u.coins = newCoins
      localStorage.setItem('tenza_current_user', JSON.stringify(u))
    }
  } catch {}

  window.dispatchEvent(new CustomEvent('coins-updated'))
}

export function getUserCoins(emailOrLogin) {
  const user = findUser(emailOrLogin)
  return user?.coins || 0
}

export function deductUserCoins(email, amount) {
  if (!email || !amount) return
  const user = findUser(email)
  if (!user) return
  const current = user.coins || 0
  saveUserCoins(email, Math.max(0, current - amount))
}

export function addUserCoins(email, amount) {
  if (!email || !amount) return
  const user = findUser(email)
  if (!user) return
  const current = user.coins || 0
  saveUserCoins(email, current + amount)
}

export function getUserByEmail(email) {
  return findUser(email)
}

export function updateSession(user) {
  if (!user) return
  saveUserCoins(user.email || user.login, user.coins)
}

export const COIN_USD_VALUE = 0.005

export function calculateCoinReward(total) {
  const amount = parseFloat(total)
  if (amount >= 500) return 1000
  if (amount >= 200) return 300
  if (amount >= 100) return Math.floor(amount)
  if (amount >= 50) return 25
  return 0
}

export function processOrderCoins(order, action) {
  const userKey = order.login || order.email

  if (action === 'CONFIRM') {
    let coinsDeducted = 0
    let coinsEarned = 0
    let remainingPayment = order.total || order.totalPrice || 0

    if (order.coinsUsed && order.coinsUsed > 0) {
      coinsDeducted = order.coinsUsed
      const usdCovered = coinsDeducted * COIN_USD_VALUE
      remainingPayment = Math.max(0, remainingPayment - usdCovered)
      deductUserCoins(userKey, coinsDeducted)
    }

    coinsEarned = calculateCoinReward(order.total || order.totalPrice || 0)
    if (coinsEarned > 0) {
      addUserCoins(userKey, coinsEarned)
    }

    return {
      coinsDeducted,
      coinsEarned,
      remainingPayment,
      newBalance: getUserCoins(userKey)
    }
  }

  if (action === 'CANCEL') {
    return {
      coinsDeducted: 0,
      coinsEarned: 0,
      remainingPayment: order.total || order.totalPrice || 0,
      newBalance: getUserCoins(userKey)
    }
  }

  return null
}

export function addNotification(email, data) {
  if (!email) return
  const notifs = JSON.parse(localStorage.getItem('tenza_notifications') || '{}')
  if (!notifs[email]) notifs[email] = []
  notifs[email].unshift({
    id: 'NOTIF-' + Date.now().toString(36),
    ...data,
    createdAt: new Date().toISOString(),
    read: false
  })
  localStorage.setItem('tenza_notifications', JSON.stringify(notifs))
  window.dispatchEvent(new CustomEvent('notification-added'))
}
