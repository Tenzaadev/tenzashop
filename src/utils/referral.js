'use client'

import { addNotification } from '@/data/notifications'

const REFERRAL_HISTORY_KEY = 'tenza_referral_history'

export function getReferralLink(referralCode) {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/register?ref=${referralCode}`
}

export function detectReferralCode(searchParams) {
  if (!searchParams) return null
  const code = searchParams.get('ref')
  if (!code) return null
  const cleaned = code.trim().toUpperCase()
  return cleaned.startsWith('TENZA-') ? cleaned : null
}

export function getReferrerName(referralCode) {
  try {
    const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
    const referrer = Object.values(users).find(u => u.referralCode === referralCode)
    return referrer?.login || null
  } catch {
    return null
  }
}

export function getReferrerByCode(referralCode) {
  try {
    const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
    return Object.values(users).find(u => u.referralCode === referralCode) || null
  } catch {
    return null
  }
}

export function awardReferralCoins(referrerLogin, newUserLogin) {
  try {
    const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
    const referrerKey = `tenza_user_${referrerLogin.toLowerCase().trim()}`
    const newUserKey = `tenza_user_${newUserLogin.toLowerCase().trim()}`

    if (users[referrerKey]) {
      users[referrerKey].coins = (users[referrerKey].coins || 0) + 25
      users[referrerKey].referralCount = (users[referrerKey].referralCount || 0) + 1
    }

    if (users[newUserKey]) {
      users[newUserKey].referredBy = referrerLogin
    }

    localStorage.setItem('tenza_users', JSON.stringify(users))

    addReferralHistory(referrerLogin, newUserLogin, 25)

    if (referrerLogin) {
      addNotification(referrerLogin, {
        type: 'referral_bonus',
        title: '🎉 Referal bonusi!',
        message: `${newUserLogin} sizning linkingiz orqali ro'yxatdan o'tdi! +25 coin`,
        createdAt: new Date().toISOString(),
        read: false,
      })
    }

    window.dispatchEvent(new CustomEvent('coins-updated'))

    return true
  } catch {
    return false
  }
}

export function addReferralHistory(referrer, newUser, coinsAwarded) {
  try {
    const history = JSON.parse(localStorage.getItem(REFERRAL_HISTORY_KEY) || '[]')
    history.push({
      referrer,
      newUser,
      coinsAwarded,
      date: new Date().toISOString(),
    })
    localStorage.setItem(REFERRAL_HISTORY_KEY, JSON.stringify(history))
  } catch {}
}

export function getReferralHistory() {
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function getCoinsFromStorage() {
  try {
    const user = JSON.parse(localStorage.getItem('tenza_current_user'))
    return user?.coins || 0
  } catch {
    return 0
  }
}
