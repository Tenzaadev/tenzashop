'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Heart, ShoppingBag, Bell, Menu, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useI18n } from '@/i18n'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/context/AuthContext'
import { getProducts } from '@/data/productStore'
import { getUnreadCount } from '@/data/notifications'
import LanguageSwitcher from './LanguageSwitcher'
import HamburgerMenu from './HamburgerMenu'

export default function Header() {
  const { t, locale, formatPrice } = useI18n()
  const { totalQuantity, setCartOpen, loaded } = useCart()
  const { wishlistCount } = useWishlist()
  const { user } = useAuth()
  const router = useRouter()
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('tenza_user_email') : null

  useEffect(() => {
    setUnreadNotifs(getUnreadCount(userEmail))
    const h = () => setUnreadNotifs(getUnreadCount(userEmail))
    window.addEventListener('notification-added', h)
    const iv = setInterval(() => setUnreadNotifs(getUnreadCount(userEmail)), 3000)
    return () => { window.removeEventListener('notification-added', h); clearInterval(iv) }
  }, [userEmail])

  useEffect(() => {
    const handleSearch = () => setSearchOpen(true)
    const handleHamburger = () => setHamburgerOpen(true)
    window.addEventListener('open-search', handleSearch)
    window.addEventListener('open-hamburger', handleHamburger)
    return () => {
      window.removeEventListener('open-search', handleSearch)
      window.removeEventListener('open-hamburger', handleHamburger)
    }
  }, [])

  const productName = (product) => (typeof product.name === 'string' ? product.name : product.name?.[locale] || product.name?.en || '')

  const filteredProducts = searchQuery.trim()
    ? getProducts().filter((p) => {
      const q = searchQuery.toLowerCase()
      if (typeof p.name === 'string') return p.name.toLowerCase().includes(q)
      return Object.values(p.name || {}).some((n) => String(n).toLowerCase().includes(q))
    }).slice(0, 6)
    : []

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black text-white hover:text-[#ccff00] transition-colors">
              TENZA
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">{t('home')}</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 flex items-center justify-center transition-all group">
              <Search size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <Link href="/wishlist" className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all group">
              <Heart size={20} className="text-gray-400 group-hover:text-red-400 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 flex items-center justify-center transition-all group">
              <ShoppingBag size={20} className="text-gray-400 group-hover:text-[#ccff00] transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ccff00] text-black text-xs font-bold rounded-full flex items-center justify-center">{totalQuantity}</span>
              )}
            </button>
            <Link href="/notifications" className="hidden md:flex relative w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 items-center justify-center transition-all group">
              <Bell size={20} className="text-gray-400 group-hover:text-[#ccff00] transition-colors" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>
              )}
            </Link>
            <LanguageSwitcher />
            {user?.login ? (
              <Link href="/profile" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 flex items-center justify-center transition-all group">
                <span className="text-xs font-bold text-[#ccff00]">{user.login[0].toUpperCase()}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login" className="px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors">
                  {t('login') || 'Kirish'}
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-xs font-bold bg-[#ccff00] text-black rounded-full hover:bg-white transition-all">
                  {t('register') || "Ro'yxatdan o'tish"}
                </Link>
              </div>
            )}
            <button onClick={() => setHamburgerOpen(true)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 flex items-center justify-center transition-all group">
              <Menu size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <HamburgerMenu open={hamburgerOpen} onClose={() => setHamburgerOpen(false)} />

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
            onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-xl mx-4 overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search size={22} className="text-[#ccff00] flex-shrink-0" />
                <input type="text" placeholder={t('search_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-lg w-full outline-none placeholder-gray-500" autoFocus />
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {searchQuery.trim() === '' ? (
                  <p className="text-gray-500 text-center py-8 text-sm">{t('type_to_search')}</p>
                ) : filteredProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{t('no_results')}</p>
                ) : (
                  filteredProducts.map(product => (
                    <Link key={product.id} href={`/product/${product.id}`} onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group">
                      <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                        {product.image && <Image src={product.image} alt={productName(product)} width={48} height={48} className="object-cover w-full h-full" unoptimized />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate group-hover:text-[#ccff00] transition-colors">{productName(product)}</p>
                        <p suppressHydrationWarning className="text-gray-500 text-sm">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
