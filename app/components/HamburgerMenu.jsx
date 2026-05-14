'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, User, Package, Star, MessageSquare } from 'lucide-react'
import { categories } from '@/data/categories'
import { useI18n } from '@/i18n'

const categoryEmojis = {
  hoodie: '🧥', tshirt: '👕', pants: '👖', shorts: '🩳',
  jacket: '🧥', windbreaker: '🌬️', sneakers: '👟', accessories: '🎒', limited: '💎',
}

const L = {
  uz: { profile: "Profil", orders: "Buyurtmalar", purchases: "Xaridlar", support: "Qo'llab-quvvatlash", categories: "Kategoriyalar" },
  ru: { profile: "Профиль", orders: "Заказы", purchases: "Покупки", support: "Поддержка", categories: "Категории" },
  en: { profile: "Profile", orders: "Orders", purchases: "Purchases", support: "Support", categories: "Categories" },
  fi: { profile: "Profiili", orders: "Tilaukset", purchases: "Ostokset", support: "Tuki", categories: "Kategoriat" },
  sv: { profile: "Profil", orders: "Beställningar", purchases: "Köp", support: "Support", categories: "Kategorier" },
}

export default function HamburgerMenu({ open, onClose }) {
  const { t, locale } = useI18n()
  const lang = L[locale] || L.uz

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-bold text-lg">{t('menu') || 'Menyu'}</span>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1 mb-6">
                <Link href="/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <User size={20} /> <span>{lang.profile}</span> <span className="ml-auto text-gray-600">→</span>
                </Link>
                <Link href="/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <Package size={20} /> <span>{lang.orders}</span> <span className="ml-auto text-gray-600">→</span>
                </Link>
                <Link href="/purchases" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <Star size={20} /> <span>{lang.purchases}</span> <span className="ml-auto text-gray-600">→</span>
                </Link>
                <Link href="/support" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <MessageSquare size={20} /> <span>{lang.support}</span> <span className="ml-auto text-gray-600">→</span>
                </Link>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider px-3 mb-2">{lang.categories}</h3>
                <div className="space-y-1">
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <Link key={cat.id} href={`/?category=${cat.slug}`} onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
                      <span>{categoryEmojis[cat.id] || '•'}</span>
                      <span>{t(cat.nameKey)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
