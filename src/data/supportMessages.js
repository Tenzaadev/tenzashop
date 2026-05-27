'use client'

const SUPPORT_KEY = 'tenza_support'

export function saveSupportMessage(data) {
  const messages = getSupportMessages()
  const newMsg = {
    id: 'MSG-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5),
    name: data.name || '',
    email: data.email || '',
    subject: data.subject || 'Umumiy',
    orderId: data.orderId || '',
    message: data.message || '',
    status: 'pending',
    adminViewed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: []
  }
  messages.unshift(newMsg)
  localStorage.setItem(SUPPORT_KEY, JSON.stringify(messages))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('support-message-updated'))
    window.dispatchEvent(new CustomEvent('support-updated'))
  }
  return newMsg
}

export function getSupportMessages() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_KEY) || '[]')
  } catch { return [] }
}

export function getSupportMessageById(id) {
  return getSupportMessages().find(m => m.id === id) || null
}

export function addAdminReply(messageId, replyText) {
  const messages = getSupportMessages()
  const index = messages.findIndex(m => m.id === messageId)
  if (index >= 0) {
    const reply = {
      id: 'REPLY-' + Date.now().toString(36),
      from: 'admin',
      text: replyText,
      createdAt: new Date().toISOString()
    }
    messages[index].replies.push(reply)
    messages[index].status = 'replied'
    messages[index].updatedAt = new Date().toISOString()
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(messages))

    addCustomerNotification(messages[index].email, messageId, replyText)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('support-message-updated'))
      window.dispatchEvent(new CustomEvent('support-updated'))
    }
    return messages[index]
  }
  return null
}

export function addCustomerReply(messageId, replyText) {
  const messages = getSupportMessages()
  const index = messages.findIndex(m => m.id === messageId)
  if (index >= 0) {
    const reply = {
      id: 'REPLY-' + Date.now().toString(36),
      from: 'customer',
      text: replyText,
      createdAt: new Date().toISOString()
    }
    messages[index].replies.push(reply)
    messages[index].status = 'pending'
    messages[index].adminViewed = false
    messages[index].updatedAt = new Date().toISOString()
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(messages))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('support-message-updated'))
      window.dispatchEvent(new CustomEvent('support-updated'))
    }
    return messages[index]
  }
  return null
}

export function closeTicket(messageId) {
  const messages = getSupportMessages()
  const index = messages.findIndex(m => m.id === messageId)
  if (index >= 0) {
    messages[index].status = 'closed'
    messages[index].updatedAt = new Date().toISOString()
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(messages))
  }
}

export function getPendingCount() {
  return getSupportMessages().filter(m => m.status === 'pending' && !m.adminViewed).length
}

export function markAsAdminViewed(messageId) {
  const messages = getSupportMessages()
  const index = messages.findIndex(m => m.id === messageId)
  if (index >= 0) {
    messages[index].adminViewed = true
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(messages))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('support-message-updated'))
      window.dispatchEvent(new CustomEvent('support-updated'))
    }
  }
}

export function getMessagesByEmail(email) {
  if (!email) return []
  return getSupportMessages().filter(m => m.email === email)
}

function addCustomerNotification(email, messageId, replyText) {
  if (typeof window === 'undefined' || !email) return
  try {
    const allNotifs = JSON.parse(localStorage.getItem('tenza_notifications') || '{}')
    if (!allNotifs[email]) allNotifs[email] = []
    const newNotif = {
      id: 'NOTIF-' + Date.now().toString(36),
      type: 'support_reply',
      supportMessageId: messageId,
      title: "Qo'llab-quvvatlashdan javob",
      message: replyText.substring(0, 100) + (replyText.length > 100 ? '...' : ''),
      createdAt: new Date().toISOString(),
      read: false
    }
    allNotifs[email].unshift(newNotif)
    localStorage.setItem('tenza_notifications', JSON.stringify(allNotifs))
    window.dispatchEvent(new CustomEvent('notification-added'))
  } catch (e) {
    console.error('Failed to add notification:', e)
  }
}
