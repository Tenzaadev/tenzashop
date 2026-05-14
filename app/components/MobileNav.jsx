'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useI18n } from '@/i18n'

const labels = {
  uz: ['Bosh', 'Izla', 'Savat', 'Like', 'Menyu'],
  ru: ['Главная', 'Поиск', 'Корзина', 'Избр.', 'Меню'],
  en: ['Home', 'Search', 'Cart', 'Wish', 'Menu'],
  fi: ['Koti', 'Haku', 'Kori', 'Suos', 'Valikko'],
  sv: ['Hem', 'Sök', 'Korg', 'Önska', 'Meny'],
}

export default function MobileNav() {
  const pathname = usePathname()
  const { totalQuantity, setCartOpen } = useCart()
  const { wishlistCount } = useWishlist()
  const { locale, t } = useI18n()
  const langLabels = labels[locale] || labels.uz

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around h-16">
        <Link href="/" className={`flex flex-col items-center gap-0.5 ${pathname === '/' ? 'text-[#ccff00]' : 'text-gray-500'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">{langLabels[0]}</span>
        </Link>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-search'))} className="flex flex-col items-center gap-0.5 text-gray-500">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-medium">{langLabels[1]}</span>
        </button>
        <button onClick={() => setCartOpen(true)} className="flex flex-col items-center gap-0.5 text-gray-500 relative">
          <span className="text-xl">🛒</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-black text-[10px] font-bold rounded-full flex items-center justify-center">{totalQuantity}</span>
          )}
          <span className="text-[10px] font-medium">{langLabels[2]}</span>
        </button>
        <Link href="/wishlist" className={`flex flex-col items-center gap-0.5 relative ${pathname === '/wishlist' ? 'text-[#ccff00]' : 'text-gray-500'}`}>
          <span className="text-xl">❤️</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
          )}
          <span className="text-[10px] font-medium">{langLabels[3]}</span>
        </Link>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-hamburger'))} className="flex flex-col items-center gap-0.5 text-gray-500">
          <span className="text-xl">☰</span>
          <span className="text-[10px] font-medium">{langLabels[4]}</span>
        </button>
      </div>
    </nav>
  )
}
