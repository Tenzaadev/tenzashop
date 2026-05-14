'use client'
import { useContext } from 'react'
import { WishlistContext } from '@/context/WishlistContext'
import { createContext } from 'react'

const fallbackContext = createContext({
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  wishlistCount: 0,
  loaded: false
})

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    console.warn('useWishlist used outside WishlistProvider, using fallback')
    return useContext(fallbackContext)
  }
  return context
}