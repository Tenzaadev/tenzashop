'use client'

const NOTIF_KEY = 'tenza_notifications'

function safe(fn, fallback = null) {
  try { return fn() } catch { return fallback }
}

export function getNotifications(userEmail) {
  if (!userEmail || typeof window === 'undefined') return []
  return safe(() => {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}')
    return all[userEmail] || []
  }, [])
}

export function addNotification(userEmail, notification) {
  if (!userEmail) return null
  return safe(() => {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}')
    if (!all[userEmail]) all[userEmail] = []
    const newNotif = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    }
    all[userEmail].unshift(newNotif)
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all))
    window.dispatchEvent(new CustomEvent('notification-added'))
    return newNotif
  }, null)
}

export function markAsRead(userEmail, notifId) {
  if (!userEmail) return
  safe(() => {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}')
    if (all[userEmail]) {
      all[userEmail] = all[userEmail].map(n =>
        n.id === notifId ? { ...n, read: true } : n
      )
      localStorage.setItem(NOTIF_KEY, JSON.stringify(all))
      window.dispatchEvent(new CustomEvent('notification-added'))
    }
  })
}

export function markAllAsRead(userEmail) {
  if (!userEmail) return
  safe(() => {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}')
    if (all[userEmail]) {
      all[userEmail] = all[userEmail].map(n => ({ ...n, read: true }))
      localStorage.setItem(NOTIF_KEY, JSON.stringify(all))
    }
    window.dispatchEvent(new CustomEvent('notification-added'))
  })
}

export function getUnreadCount(userEmail) {
  if (!userEmail) return 0
  return safe(() => getNotifications(userEmail).filter(n => !n.read).length, 0)
}

export function deleteNotification(userEmail, notifId) {
  if (!userEmail) return
  safe(() => {
    const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}')
    if (all[userEmail]) {
      all[userEmail] = all[userEmail].filter(n => n.id !== notifId)
      localStorage.setItem(NOTIF_KEY, JSON.stringify(all))
    }
    window.dispatchEvent(new CustomEvent('notification-added'))
  })
}
