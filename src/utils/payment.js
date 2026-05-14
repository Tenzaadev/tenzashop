'use client'

export function generateOrderId() {
  return 'TENZA-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()
}

export function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
  orders.unshift(order)
  localStorage.setItem('tenza_orders', JSON.stringify(orders))
  return order
}

export function clearCart() {
  localStorage.setItem('tenza_cart', JSON.stringify({ items: [], totalQuantity: 0, totalPrice: 0 }))
  window.dispatchEvent(new CustomEvent('cart-updated'))
}

export function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem('tenza_cart') || 'null')
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.items)) return data.items
    return []
  } catch { return [] }
}

export function getUserCoinsFromStorage() {
  try {
    const session = JSON.parse(localStorage.getItem('tenza_user') || 'null')
    if (session?.coins) return session.coins
    const current = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
    if (current?.coins) return current.coins
    const raw = localStorage.getItem('tenza_users')
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data) && data.length > 0) return data[0]?.coins || 0
      const vals = Object.values(data)
      if (vals.length > 0) return vals[0]?.coins || 0
    }
  } catch {}
  return 0
}

export function autoFillUserProfile() {
  try {
    const userData = JSON.parse(localStorage.getItem('tenza_user') || 'null')
    if (userData) {
      const profile = {
        customerName: userData.nickname || userData.name || '',
        customerEmail: userData.email || '',
        customerPhone: userData.phone || '',
        city: userData.city || '',
        address: userData.address || '',
        postalCode: userData.postalCode || '',
        floor: userData.floor || '',
        doorCode: userData.doorCode || '',
      }
      const currentUser = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
      if (currentUser?.login && !profile.customerEmail) {
        profile.customerEmail = currentUser.login
      }
      const users = JSON.parse(localStorage.getItem('tenza_users') || '[]')
      const email = profile.customerEmail
      if (email) {
        const fullUser = Array.isArray(users)
          ? users.find(u => u.email === email || u.nickname === userData?.nickname)
          : Object.values(users).find(u => u.email === email || u.nickname === userData?.nickname)
        if (fullUser) {
          if (fullUser.city && !profile.city) profile.city = fullUser.city
          if (fullUser.address && !profile.address) profile.address = fullUser.address
          if (fullUser.postalCode && !profile.postalCode) profile.postalCode = fullUser.postalCode
          if (fullUser.floor && !profile.floor) profile.floor = fullUser.floor
          if (fullUser.doorCode && !profile.doorCode) profile.doorCode = fullUser.doorCode
        }
      }
      return profile
    }
    const currentUser = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
    if (currentUser?.login) {
      return {
        customerName: currentUser.login,
        customerEmail: currentUser.login,
        customerPhone: '',
        city: '', address: '', postalCode: '', floor: '', doorCode: '',
      }
    }
  } catch {}
  return {
    customerName: '', customerEmail: '', customerPhone: '',
    city: '', address: '', postalCode: '', floor: '', doorCode: '',
  }
}

export function saveProfileData(form) {
  try {
    const userData = JSON.parse(localStorage.getItem('tenza_user') || 'null')
    if (!userData) return
    const users = JSON.parse(localStorage.getItem('tenza_users') || '[]')
    const idx = Array.isArray(users)
      ? users.findIndex(u => u.email === userData.email || u.nickname === userData.nickname)
      : -1
    if (idx >= 0) {
      users[idx].address = form.address
      users[idx].city = form.city
      users[idx].phone = form.customerPhone
      users[idx].postalCode = form.postalCode
      users[idx].floor = form.floor
      users[idx].doorCode = form.doorCode
      localStorage.setItem('tenza_users', JSON.stringify(users))
    }
    userData.address = form.address
    userData.city = form.city
    userData.phone = form.customerPhone
    localStorage.setItem('tenza_user', JSON.stringify(userData))
  } catch {}
}

const TELEGRAM_BOT_TOKEN = '7703924617:AAG2cSAOSW4t5rZBQVF7GQ44w9puHVPf_Ks'
const TELEGRAM_CHAT_ID = '5858506414'

export async function sendTelegramNotification(order) {
  try {
    const text = [
      '🛍 *YANGI BUYURTMA*',
      '',
      `📋 ID: #${order.id || order.orderId}`,
      `👤 Mijoz: ${order.customerName || order.fullName}`,
      `📧 Email: ${order.email}`,
      `📞 Telefon: ${order.phone}`,
      `📍 Manzil: ${order.city}, ${order.address}`,
      `💰 Summa: $${(order.total || order.totalPrice || 0).toFixed(2)}`,
      order.coinsUsed > 0 ? `🪙 Ishlatilgan coin: ${order.coinsUsed}` : '',
      order.coinsEarned > 0 ? `🎁 Bonus coin: +${order.coinsEarned}` : '',
      `🕐 Vaqt: ${new Date().toLocaleString()}`,
      '',
      `👨‍💼 Admin: /admin`
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      })
    })
  } catch (e) {
    console.error('Telegram notify failed:', e)
  }
}
