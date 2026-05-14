'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Trash2, RotateCcw } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/hooks/useCart'
import { getOrders } from '@/data/orders'
import { getProductReviews, saveReview, deleteReview } from '../components/ProductReviews'
import StarRating from '../components/StarRating'
import PhotoReview from '@/components/PhotoReview'
import ReviewCard from '@/components/ReviewCard'

const L = {
  uz: {
    title: "Sotib olingan mahsulotlar", empty: "Hali mahsulot sotib olinmagan", emptyAction: "Xarid qilishni boshlash",
    delivered: "Yetkazildi", yourRating: "Baholang:", commentPlaceholder: "Izoh yozing (ixtiyoriy)...",
    save: "Saqlash", saved: "Saqlandi!", edit: "Tahrirlash", remove: "O'chirish", cancel: "Bekor qilish",
    notLoggedIn: "Iltimos, avval tizimga kiring", login: "Kirish", buyAgain: "Qayta xarid qilish",
  },
  ru: {
    title: "Купленные товары", empty: "Товары ещё не куплены", emptyAction: "Начать покупки",
    delivered: "Доставлено", yourRating: "Оцените:", commentPlaceholder: "Напишите отзыв (необязательно)...",
    save: "Сохранить", saved: "Сохранено!", edit: "Редактировать", remove: "Удалить", cancel: "Отмена",
    notLoggedIn: "Пожалуйста, войдите в систему", login: "Войти", buyAgain: "Купить снова",
  },
  en: {
    title: "Purchased Items", empty: "No items purchased yet", emptyAction: "Start shopping",
    delivered: "Delivered", yourRating: "Rate:", commentPlaceholder: "Write a comment (optional)...",
    save: "Save", saved: "Saved!", edit: "Edit", remove: "Delete", cancel: "Cancel",
    notLoggedIn: "Please log in first", login: "Login", buyAgain: "Buy again",
  },
  fi: {
    title: "Ostetut tuotteet", empty: "Ei ostettuja tuotteita", emptyAction: "Aloita ostokset",
    delivered: "Toimitettu", yourRating: "Arvioi:", commentPlaceholder: "Kirjoita kommentti (valinnainen)...",
    save: "Tallenna", saved: "Tallennettu!", edit: "Muokkaa", remove: "Poista", cancel: "Peruuta",
    notLoggedIn: "Kirjaudu ensin sisään", login: "Kirjaudu", buyAgain: "Osta uudelleen",
  },
  sv: {
    title: "Köpta produkter", empty: "Inga produkter köpta än", emptyAction: "Börja handla",
    delivered: "Levererad", yourRating: "Betygsätt:", commentPlaceholder: "Skriv en kommentar (valfritt)...",
    save: "Spara", saved: "Sparad!", edit: "Redigera", remove: "Ta bort", cancel: "Avbryt",
    notLoggedIn: "Vänligen logga in först", login: "Logga in", buyAgain: "Köp igen",
  },
}

function PurchasedProductCard({ product, locale, lang, user }) {
  const { addToCart, setCartOpen } = useCart()
  const [existingReview, setExistingReview] = useState(null)
  const [showPhotoReview, setShowPhotoReview] = useState(false)

  const productName = typeof product?.name === 'string' ? product.name : (product?.name?.[locale] || product?.name?.en || '')

  useEffect(() => {
    const reviews = getProductReviews(product.id)
    const existing = reviews.find(r => r.userId === user?.login && r.orderId === product.orderId)
    if (existing) setExistingReview(existing)
  }, [product.id, product.orderId, user?.login])

  useEffect(() => {
    const h = () => {
      const reviews = getProductReviews(product.id)
      const existing = reviews.find(r => r.userId === user?.login && r.orderId === product.orderId)
      if (existing) setExistingReview(existing)
    }
    window.addEventListener('reviews-updated', h)
    return () => window.removeEventListener('reviews-updated', h)
  }, [product.id, product.orderId, user?.login])

  const handleSaveReview = (reviewData) => {
    const saved = saveReview({
      productId: reviewData.productId,
      orderId: reviewData.orderId,
      userId: user.login,
      userName: user.login,
      rating: reviewData.rating,
      comment: reviewData.comment,
      existingId: reviewData.id,
      photos: reviewData.photos,
    })
    setExistingReview(saved)
    setShowPhotoReview(false)
  }

  const handleDeleteReview = () => {
    if (existingReview) {
      deleteReview(existingReview.id)
      setExistingReview(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={productName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👕</span>
          )}
        </div>
        <div>
          <h3 className="text-white font-bold">{productName}</h3>
          <p className="text-[#ccff00] font-bold text-sm">${product.price}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{lang.delivered}</span>
            <span className="text-gray-600 text-xs">{new Date(product.date || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        <button onClick={() => { addToCart(product); setCartOpen(true) }}
          className="self-start px-3 py-1.5 bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] rounded-lg text-xs font-bold hover:bg-[#ccff00]/20 transition-all flex items-center gap-1.5 flex-shrink-0">
          <RotateCcw size={12} /> {lang.buyAgain}
        </button>
      </div>

      {existingReview && !showPhotoReview ? (
        <div>
          <ReviewCard review={existingReview} locale={locale} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => setShowPhotoReview(true)}
              className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-all">
              ✏️ {lang.edit}
            </button>
            <button onClick={handleDeleteReview}
              className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all flex items-center gap-1">
              <Trash2 size={12} /> {lang.remove}
            </button>
          </div>
        </div>
      ) : (
        <PhotoReview
          productId={product.id}
          orderId={product.orderId}
          existingReview={existingReview}
          onSave={handleSaveReview}
          locale={locale} />
      )}
    </motion.div>
  )
}

export default function PurchasesPage() {
  const { locale } = useI18n()
  const { user } = useAuth()
  const lang = L[locale] || L.uz
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) { setItems([]); return }
    const validStatuses = ['paid', 'processing', 'shipped', 'in_transit', 'delivered']
    const orders = getOrders().filter(o =>
      (o.login === user.login || o.email === user.login) &&
      validStatuses.includes(o.status)
    )
    const all = []
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        all.push({ ...item, orderId: order.orderId || order.id, date: order.updatedAt || order.createdAt, orderStatus: order.status })
      })
    })
    setItems(all)
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">{lang.notLoggedIn}</p>
          <Link href="/login" className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl">{lang.login}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-lg mx-auto px-4 pt-20 pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> {lang.title}
        </Link>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
            <p>{lang.empty}</p>
            <Link href="/" className="text-[#ccff00] hover:underline mt-2 inline-block">{lang.emptyAction}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <PurchasedProductCard key={`${item.id}-${item.orderId}-${i}`}
                product={item} locale={locale} lang={lang} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
