'use client'
import { useContext, createContext } from 'react'
import { CartContext } from '@/context/CartContext'

const fallbackContext = createContext({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  clearCart: () => {},
  cartOpen: false,
  setCartOpen: () => {},
  loaded: false
})

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    console.warn('useCart used outside CartProvider, using fallback')
    return useContext(fallbackContext)
  }
  return context
}