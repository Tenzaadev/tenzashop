'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { WishlistContext } from './WishlistContext'

const STORAGE_KEY = 'tenza_wishlist'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setWishlist(parsed)
      }
    } catch (e) {
      console.error('Wishlist load error:', e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist, loaded])

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      }
      return [...prev, productId]
    })
  }, [])

  const isWishlisted = useCallback((productId) => {
    return wishlist.includes(productId)
  }, [wishlist])

  const value = useMemo(() => ({
    wishlist,
    toggleWishlist,
    isWishlisted,
    wishlistCount: wishlist.length,
    loaded
  }), [wishlist, toggleWishlist, isWishlisted, loaded])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}