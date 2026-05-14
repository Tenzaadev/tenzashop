'use client'

const KEY = 'tenza_support'

function safe(fn, fallback = null) {
  try { return fn() } catch { return fallback }
}

export function getSupportMessages() {
  return safe(() => JSON.parse(localStorage.getItem(KEY) || '[]'), [])
}

export function getSupportMessagesByEmail(email) {
  if (!email) return []
  return safe(() => getSupportMessages().filter(m => m.email === email), [])
}

export function addSupportMessage(msg) {
  return safe(() => {
    const all = getSupportMessages()
    const newMsg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
      read: false,
      replies: [],
      ...msg,
    }
    all.unshift(newMsg)
    localStorage.setItem(KEY, JSON.stringify(all))
    return newMsg
  }, null)
}

export function markSupportRead(id) {
  safe(() => {
    const all = getSupportMessages()
    const idx = all.findIndex(m => m.id === id)
    if (idx !== -1) { all[idx].read = true; localStorage.setItem(KEY, JSON.stringify(all)) }
  })
}

export function replyToSupportMessage(id, replyText) {
  return safe(() => {
    const all = getSupportMessages()
    const idx = all.findIndex(m => m.id === id)
    if (idx !== -1) {
      if (!all[idx].replies) all[idx].replies = []
      all[idx].replies.push({
        text: replyText,
        createdAt: new Date().toISOString(),
        by: 'admin',
      })
      localStorage.setItem(KEY, JSON.stringify(all))
      return true
    }
    return false
  }, false)
}

export function deleteSupportMessage(id) {
  safe(() => {
    const all = getSupportMessages().filter(m => m.id !== id)
    localStorage.setItem(KEY, JSON.stringify(all))
  })
}

export function getUnreadSupportCount() {
  return safe(() => getSupportMessages().filter(m => !m.read).length, 0)
}
