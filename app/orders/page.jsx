'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useCart } from '@/hooks/useCart'
import { subscribeOrders } from '@/lib/firestore'
import { itemName } from '@/utils/orders'

const statusIcons = {
  confirmed: '✅', pending_verification: '⏳', paid: '✅', processing: '📦',
  shipped: '🚚', in_transit: '✈️', delivered: '🏠',
  cancelled: '❌', returned: '🔄',
}

const L = {
  uz: { title: "Buyurtmalarim", empty: "Buyurtmalar yo'q", order: "Buyurtma", track: "Kuzatish", rate: "Baho berish", buyAgain: "Qayta xarid qilish" },
  ru: { title: "Мои заказы", empty: "Нет заказов", order: "Заказ", track: "Отследить", rate: "Оценить", buyAgain: "Купить снова" },
  en: { title: "My Orders", empty: "No orders", order: "Order", track: "Track", rate: "Rate", buyAgain: "Buy again" },
  fi: { title: "Tilaukseni", empty: "Ei tilauksia", order: "Tilaus", track: "Seuraa", rate: "Arvostele", buyAgain: "Osta uudelleen" },
  sv: { title: "Mina beställningar", empty: "Inga beställningar", order: "Beställning", track: "Spåra", rate: "Betygsätt", buyAgain: "Köp igen" },
}

const statusLabels = {
  uz: { confirmed: "Coin bilan to'landi", pending_verification: "To'lov kutilmoqda", paid: "To'landi", processing: "Tayyorlanmoqda", shipped: "Jo'natildi", in_transit: "Yo'lda", delivered: "Yetkazildi", cancelled: "Bekor qilindi", returned: "Qaytarildi" },
  ru: { confirmed: "Оплачено монетами", pending_verification: "Ожидание оплаты", paid: "Оплачено", processing: "Готовится", shipped: "Отправлен", in_transit: "В пути", delivered: "Доставлен", cancelled: "Отменён", returned: "Возвращён" },
  en: { confirmed: "Paid with coins", pending_verification: "Pending payment", paid: "Paid", processing: "Processing", shipped: "Shipped", in_transit: "In transit", delivered: "Delivered", cancelled: "Cancelled", returned: "Returned" },
  fi: { confirmed: "Maksettu kolikoilla", pending_verification: "Odottaa maksua", paid: "Maksettu", processing: "Valmistellaan", shipped: "Lähetetty", in_transit: "Matkalla", delivered: "Toimitettu", cancelled: "Peruttu", returned: "Palautettu" },
  sv: { confirmed: "Betald med mynt", pending_verification: "Väntar på betalning", paid: "Betald", processing: "Bearbetas", shipped: "Skickad", in_transit: "På väg", delivered: "Levererad", cancelled: "Avbruten", returned: "Returnerad" },
}

export default function OrdersPage() {
  const { locale, formatPrice } = useI18n()
  const { addToCart, setCartOpen } = useCart()
  const lang = L[locale] || L.uz
  const sl = statusLabels[locale] || statusLabels.uz
  const [orders, setOrders] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tenza_current_user')
      if (raw) {
        const user = JSON.parse(raw)
        const login = user?.login
        if (login) {
          const fallback = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
          setOrders(fallback.filter(o => o.login === login || o.email === login))
        }
      }
    } catch {}

    const unsub = subscribeOrders((allOrders) => {
      try {
        const raw = localStorage.getItem('tenza_current_user')
        if (!raw) { setOrders([]); return }
        const user = JSON.parse(raw)
        const login = user?.login
        if (!login) { setOrders([]); return }
        setOrders(allOrders.filter(o => o.login === login || o.email === login))
      } catch { setOrders([]) }
    })

    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-lg mx-auto px-4 pt-20 pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> {lang.title}
        </Link>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 opacity-30" />
            <p>{lang.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-gray-400">#{order.orderId || order.id}</span>
                  <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-white text-sm mb-1">
                  {itemName(order.items?.[0], locale)} — {formatPrice(order.totalPrice || order.total || 0)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300 mb-3">
                  {statusIcons[order.status] || '📋'} {sl[order.status] || order.status}
                </span>
                <div className="flex gap-2">
                  <Link href={`/tracking?order=${order.orderId || order.id}`}
                    className="flex-1 py-2 bg-white/5 rounded-xl text-center text-sm text-gray-300 hover:bg-white/10 transition-colors">
                    📦 {lang.track} →
                  </Link>
                  {order.status === 'delivered' && (
                    <>
                      <button onClick={() => {
                        order.items?.forEach(item => addToCart(item))
                        setCartOpen(true)
                      }}
                        className="flex-1 py-2 bg-white/5 rounded-xl text-center text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
                        <RotateCcw size={14} /> {lang.buyAgain}
                      </button>
                      <Link href="/purchases"
                        className="flex-1 py-2 bg-[#ccff00]/10 rounded-xl text-center text-sm text-[#ccff00] hover:bg-[#ccff00]/20 transition-colors">
                        ⭐ {lang.rate}
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
