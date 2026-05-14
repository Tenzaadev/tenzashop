import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      allUsers: {},
      mounted: false,
      register: () => ({ success: false, error: 'Auth not initialized' }),
      login: () => ({ success: false, error: 'Auth not initialized' }),
      logout: () => {},
      addPurchaseBonus: () => {},
      getUserByReferralCode: () => null,
      getStats: () => ({ totalUsers: 0, totalCoins: 0, totalPurchases: 0 }),
      isLoginTaken: () => false
    }
  }
  return context
}