'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const STORAGE_KEY = 'tenza_loyalty'

export function useLoyalty() {
  const { user } = useAuth()
  const [coins, setCoins] = useState(0)
  const [history, setHistory] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        setCoins(data.coins || 0)
        setHistory(data.history || [])
      }
    } catch (e) {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins, history }))
    }
  }, [coins, history, loaded, user])

  const totalCoins = user ? user.coins : coins

  const addCoins = (amountUSD, reason = 'Purchase') => {
    const coinsToAdd = Math.floor(amountUSD)
    if (user) {
      const key = 'tenza_user_' + user.login.toLowerCase()
      const allUsers = JSON.parse(localStorage.getItem('tenza_users') || '{}')
      if (allUsers[key]) {
        allUsers[key].coins = (allUsers[key].coins || 0) + coinsToAdd
        allUsers[key].purchases = [...(allUsers[key].purchases || []), { date: new Date().toISOString(), amount: amountUSD, bonus: coinsToAdd, reason }]
        localStorage.setItem('tenza_users', JSON.stringify(allUsers))
        localStorage.setItem('tenza_current_user', JSON.stringify(allUsers[key]))
      }
    } else {
      setCoins(prev => prev + coinsToAdd)
      setHistory(prev => [{
        id: Date.now(),
        amount: coinsToAdd,
        reason,
        date: new Date().toISOString(),
        type: 'earned'
      }, ...prev])
    }
  }

  const useCoins = (amount) => {
    if (totalCoins < amount) return false
    
    if (user) {
      const key = 'tenza_user_' + user.login.toLowerCase()
      const allUsers = JSON.parse(localStorage.getItem('tenza_users') || '{}')
      if (allUsers[key]) {
        allUsers[key].coins = Math.max(0, (allUsers[key].coins || 0) - amount)
        localStorage.setItem('tenza_users', JSON.stringify(allUsers))
        localStorage.setItem('tenza_current_user', JSON.stringify(allUsers[key]))
      }
    } else {
      setCoins(prev => Math.max(0, prev - amount))
    }
    return true
  }

  const useCoinsForDiscount = (amount) => {
    if (totalCoins < amount) return null
    
    if (user) {
      const key = 'tenza_user_' + user.login.toLowerCase()
      const allUsers = JSON.parse(localStorage.getItem('tenza_users') || '{}')
      if (allUsers[key]) {
        allUsers[key].coins = Math.max(0, (allUsers[key].coins || 0) - amount)
        localStorage.setItem('tenza_users', JSON.stringify(allUsers))
        localStorage.setItem('tenza_current_user', JSON.stringify(allUsers[key]))
        return amount / 100
      }
    } else {
      setCoins(prev => {
        const newCoins = Math.max(0, prev - amount)
        setHistory(prev => [{
          id: Date.now(),
          amount: -amount,
          reason: `${(amount / 100).toFixed(2)} discount`,
          date: new Date().toISOString(),
          type: 'spent'
        }, ...prev])
        return newCoins
      })
      return amount / 100
    }
    return null
  }

  const getDiscountValue = () => totalCoins / 100

  return { 
    coins: totalCoins, 
    addCoins, 
    useCoins,
    useCoinsForDiscount, 
    getDiscountValue, 
    history: user ? (user.purchases || []) : history, 
    loaded 
  }
}