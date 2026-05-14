'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, Trash2, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useI18n } from '@/i18n'

export default function CartDrawer() {
  const { t, formatPrice, locale } = useI18n()
  const { items, totalPrice, removeFromCart, incrementQuantity, decrementQuantity, loaded, cartOpen, setCartOpen } = useCart()
  const router = useRouter()

  const productName = (item) => (typeof item.name === 'string' ? item.name : item.name?.[locale] || item.name?.en || '')

  const drawerRef = useRef(null)

  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tenza_user')
      if (saved) { setUser(JSON.parse(saved)); return }
      const currentUser = localStorage.getItem('tenza_current_user')
      if (currentUser) {
        const parsed = JSON.parse(currentUser)
        setUser({ name: parsed.login, email: parsed.login, ...parsed })
      }
    } catch {}
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === drawerRef.current || !drawerRef.current?.contains(e.target)) {
      setCartOpen(false)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      setShowRegister(true)
      return
    }
    setCartOpen(false)
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
            onClick={handleBackdropClick}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-[#ccff00]" />
                <h2 className="text-xl font-black text-white">{t('cart')}</h2>
                {loaded && items?.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#ccff00] text-black text-xs font-bold rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!loaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin" />
                </div>
              ) : items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={60} className="text-gray-700 mb-4" />
                  <p className="text-white font-bold text-lg mb-2">{t('cart_empty')}</p>
                  <p className="text-gray-500 text-sm mb-6">{t('cart_continue')}</p>
                  <button onClick={() => { setCartOpen(false); router.push('/') }} className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-full hover:bg-[#ddff33] transition-all">
                    {t('view_collection') || "Kolleksiyani ko'rish"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(items || []).map((item, i) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-3 bg-white/[0.02] rounded-xl"
                    >
                      <div className="w-20 h-20 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                        {item.image && (
                          <Image src={item.image} alt={productName(item)} width={80} height={80} className="object-cover w-full h-full" unoptimized />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{productName(item)}</p>
                        <p className="text-gray-500 text-xs">{item.size} / {item.color}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg">
                            <button onClick={() => decrementQuantity(i)} className="p-1.5 hover:text-[#ccff00] transition-colors">
                              <Minus size={14} className="text-gray-400" />
                            </button>
                            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => incrementQuantity(i)} className="p-1.5 hover:text-[#ccff00] transition-colors">
                              <Plus size={14} className="text-gray-400" />
                            </button>
                          </div>
                          <p suppressHydrationWarning className="text-[#ccff00] font-bold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(i)} className="self-start p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items?.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {user && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                    <User size={14} className="text-green-400" />
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                    <span className="text-green-400 text-sm font-bold">✓</span>
                  </div>
                )}
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">{t('cart_total')}:</span>
                  <span suppressHydrationWarning className="text-xl font-bold text-[#ccff00]">{formatPrice(totalPrice || 0)}</span>
                </div>
                <button onClick={handleCheckout}
                  className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-[#ddff33] transition-colors text-lg flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  {t('checkout')}
                </button>
              </div>
            )}
            {showRegister && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRegister(false)}>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-white mb-1">Ro'yxatdan o'tish</h3>
                  <p className="text-gray-400 text-sm mb-4">Buyurtma berish uchun ro'yxatdan o'ting</p>
                  <div className="space-y-3">
                    <input placeholder="Ism yoki Nikname *" value={regName} onChange={e => setRegName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" />
                    <input type="email" placeholder="Email *" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" />
                    <input type="tel" placeholder="Telefon *" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500" />
                    <button onClick={() => {
                      if (!regName || !regEmail || !regPhone) return
                      const userData = { name: regName, email: regEmail, phone: regPhone, registeredAt: new Date().toISOString() }
                      localStorage.setItem('tenza_user', JSON.stringify(userData))
                      localStorage.setItem('tenza_user_email', regEmail)
                      setUser(userData)
                      setShowRegister(false)
                    }} disabled={!regName || !regEmail || !regPhone}
                      className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-xl disabled:opacity-30">
                      Ro'yxatdan o'tish
                    </button>
                    <button onClick={() => setShowRegister(false)} className="w-full py-2 text-gray-400 text-sm">
                      Keyinroq
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        </>
      )}
    </AnimatePresence>
  )
}