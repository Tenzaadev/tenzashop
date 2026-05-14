'use client'
import { createContext, useReducer, useEffect, useState, useCallback } from 'react'
import { cartReducer, initialCartState } from '@/reducers/cartReducer'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const [cartOpen, setCartOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tenza_cart')
        if (saved) dispatch({ type: 'HYDRATE_CART', payload: JSON.parse(saved) })
      } catch (e) {
        console.error('Cart hydrate error:', e)
      }
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      localStorage.setItem('tenza_cart', JSON.stringify(state))
    }
  }, [state, loaded])

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }, [])

  const removeFromCart = useCallback((index) => {
    const item = state.items[index]
    if (item) {
      const cartId = `${item.id}-${item.size}-${item.color}`
      dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
    }
  }, [state.items])

  const incrementQuantity = useCallback((index) => {
    const item = state.items[index]
    if (item) {
      const cartId = `${item.id}-${item.size}-${item.color}`
      dispatch({ type: 'INCREMENT_QUANTITY', payload: cartId })
    }
  }, [state.items])

  const decrementQuantity = useCallback((index) => {
    const item = state.items[index]
    if (item) {
      const cartId = `${item.id}-${item.size}-${item.color}`
      dispatch({ type: 'DECREMENT_QUANTITY', payload: cartId })
    }
  }, [state.items])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    cartOpen,
    setCartOpen,
    loaded
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}