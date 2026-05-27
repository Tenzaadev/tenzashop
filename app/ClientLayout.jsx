'use client'

import { I18nProvider } from '@/i18n'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistProvider'
import { AuthProvider } from '@/context/AuthContext'
import CartDrawer from './components/cart/CartDrawer'
import Footer from './components/Footer'

export default function ClientLayout({ children }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  )
}