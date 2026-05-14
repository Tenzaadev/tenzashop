'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { products } from '@/data/products'
import Header from '../components/Header'

const L = {
  uz: {
    title: "Sevimlilar", empty: "Sevimli mahsulotlar yo'q", emptyDesc: "Mahsulotdagi ♡ belgisini bosib sevimlilarga qo'shing",
    startShopping: "Xarid qilishni boshlash", remove: "O'chirish", addToCart: "Savatga qo'shish",
  },
  ru: {
    title: "Избранное", empty: "Нет избранных товаров", emptyDesc: "Нажмите ♡ на товаре, чтобы добавить в избранное",
    startShopping: "Начать покупки", remove: "Удалить", addToCart: "В корзину",
  },
  en: {
    title: "Favorites", empty: "No favorite items", emptyDesc: "Click ♡ on a product to add to favorites",
    startShopping: "Start shopping", remove: "Remove", addToCart: "Add to cart",
  },
  fi: {
    title: "Suosikit", empty: "Ei suosikkituotteita", emptyDesc: "Paina ♡ tuotteessa lisätäksesi suosikkeihin",
    startShopping: "Aloita ostokset", remove: "Poista", addToCart: "Lisää ostoskoriin",
  },
  sv: {
    title: "Favoriter", empty: "Inga favoritprodukter", emptyDesc: "Tryck på ♡ på en produkt för att lägga till i favoriter",
    startShopping: "Börja handla", remove: "Ta bort", addToCart: "Lägg i varukorg",
  },
}

export default function WishlistPage() {
  const { locale, formatPrice } = useI18n()
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart, setCartOpen } = useCart()
  const lang = L[locale] || L.uz
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(products.filter(p => wishlist.includes(p.id)))
  }, [wishlist])

  const productName = (p) => typeof p.name === 'string' ? p.name : (p.name?.[locale] || p.name?.en || '')

  const handleAddToCart = (product) => {
    addToCart(product)
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-lg mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> {lang.title}
          </Link>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-20">
              <Heart size={64} className="mx-auto mb-4 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-400 mb-2">{lang.empty}</h2>
              <p className="text-gray-600 text-sm mb-6">{lang.emptyDesc}</p>
              <Link href="/" className="inline-block px-8 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all">
                {lang.startShopping}
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <Link href={`/product/${product.id}`} className="w-20 h-24 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex-shrink-0">
                    {product.image && (
                      <img src={product.image} alt={productName(product)} className="w-full h-full object-cover" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-white font-bold text-sm truncate hover:text-[#ccff00] transition-colors">{productName(product)}</h3>
                    </Link>
                    <p className="text-[#ccff00] font-bold mt-0.5">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleAddToCart(product)}
                        className="flex-1 py-2 bg-[#ccff00] text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-white transition-all">
                        <ShoppingBag size={14} /> {lang.addToCart}
                      </button>
                      <button onClick={() => toggleWishlist(product.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
