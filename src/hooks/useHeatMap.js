'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'tenza_heatmap'

export function useHeatMap() {
  const [stats, setStats] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setStats(JSON.parse(saved))
    } catch (e) {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats, loaded])

  const recordView = (productId) => {
    setStats(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        views: (prev[productId]?.views || 0) + 1,
        lastViewed: Date.now(),
      }
    }))
  }

  const recordPurchase = (productId) => {
    setStats(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        purchases: (prev[productId]?.purchases || 0) + 1,
        lastPurchased: Date.now(),
      }
    }))
  }

  const getProductStats = (productId) => {
    const s = stats[productId] || { views: 0, purchases: 0 }
    return {
      ...s,
      isHot: s.purchases > 5,
      isTrending: s.views > 20,
    }
  }

  const getHotProducts = (limit = 10) => {
    return Object.entries(stats)
      .filter(([, s]) => s.purchases > 0)
      .sort(([, a], [, b]) => (b.purchases || 0) - (a.purchases || 0))
      .slice(0, limit)
      .map(([id]) => id)
  }

  const getTrendingProducts = (limit = 10) => {
    return Object.entries(stats)
      .filter(([, s]) => s.views > 0)
      .sort(([, a], [, b]) => (b.lastViewed || 0) - (a.lastViewed || 0))
      .slice(0, limit)
      .map(([id]) => id)
  }

  return { stats, recordView, recordPurchase, getProductStats, getHotProducts, getTrendingProducts, loaded }
}