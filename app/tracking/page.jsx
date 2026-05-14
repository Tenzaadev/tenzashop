'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, MessageSquare, Package, Loader2 } from 'lucide-react'

const statusSteps = [
  { key: 'pending_verification', icon: '⏳', label_uz: "To'lov kutilmoqda", label_ru: 'Ожидание оплаты', label_en: 'Pending payment', label_fi: 'Odottaa maksua', label_sv: 'Väntar på betalning' },
  { key: 'paid', icon: '✅', label_uz: "To'lov tasdiqlandi", label_ru: 'Оплата подтверждена', label_en: 'Payment confirmed', label_fi: 'Maksu vahvistettu', label_sv: 'Betalning bekräftad' },
  { key: 'processing', icon: '📦', label_uz: 'Tayyorlanmoqda', label_ru: 'Готовится', label_en: 'Processing', label_fi: 'Valmistellaan', label_sv: 'Bearbetas' },
  { key: 'shipped', icon: '🚚', label_uz: "Jo'natildi", label_ru: 'Отправлен', label_en: 'Shipped', label_fi: 'Lähetetty', label_sv: 'Skickad' },
  { key: 'in_transit', icon: '✈️', label_uz: "Yo'lda", label_ru: 'В пути', label_en: 'In transit', label_fi: 'Matkalla', label_sv: 'På väg' },
  { key: 'delivered', icon: '🏠', label_uz: 'Yetkazildi', label_ru: 'Доставлен', label_en: 'Delivered', label_fi: 'Toimitettu', label_sv: 'Levererad' },
]

const statusColors = {
  pending_verification: 'text-yellow-400 border-yellow-400 bg-yellow-500/20',
  paid: 'text-green-400 border-green-400 bg-green-500/20',
  processing: 'text-blue-400 border-blue-400 bg-blue-500/20',
  shipped: 'text-purple-400 border-purple-400 bg-purple-500/20',
  in_transit: 'text-orange-400 border-orange-400 bg-orange-500/20',
  delivered: 'text-green-400 border-green-400 bg-green-500/20',
  cancelled: 'text-red-400 border-red-400 bg-red-500/20',
  returned: 'text-gray-400 border-gray-400 bg-gray-500/20',
}

const L = {
  uz: { title: "Buyurtma kuzatuvi", notFound: "Buyurtma topilmadi", goHome: "Bosh sahifaga", order: "Buyurtma", currentStatus: "Hozirgi holat", estimatedDelivery: "Tahminiy yetkazish", trackCode: "Track kodi", company: "Kompaniya", items: "Mahsulotlar", total: "Jami", support: "Qo'llab-quvvatlash", notifications: "Bildirishnomalar", deliveryProcess: "Yetkazish jarayoni", today: "Hozir", cancelled: "Bekor qilindi", returned: "Qaytarildi" },
  ru: { title: "Отслеживание заказа", notFound: "Заказ не найден", goHome: "На главную", order: "Заказ", currentStatus: "Текущий статус", estimatedDelivery: "Примерная доставка", trackCode: "Трек-код", company: "Компания", items: "Товары", total: "Итого", support: "Поддержка", notifications: "Уведомления", deliveryProcess: "Процесс доставки", today: "Сейчас", cancelled: "Отменён", returned: "Возвращён" },
  en: { title: "Order tracking", notFound: "Order not found", goHome: "Go home", order: "Order", currentStatus: "Current status", estimatedDelivery: "Estimated delivery", trackCode: "Tracking code", company: "Company", items: "Items", total: "Total", support: "Support", notifications: "Notifications", deliveryProcess: "Delivery process", today: "Now", cancelled: "Cancelled", returned: "Returned" },
  fi: { title: "Tilauksen seuranta", notFound: "Tilausta ei löydy", goHome: "Takaisin etusivulle", order: "Tilaus", currentStatus: "Nykyinen tila", estimatedDelivery: "Arvioitu toimitus", trackCode: "Seurantakoodi", company: "Yritys", items: "Tuotteet", total: "Yhteensä", support: "Tuki", notifications: "Ilmoitukset", deliveryProcess: "Toimitusprosessi", today: "Nyt", cancelled: "Peruttu", returned: "Palautettu" },
  sv: { title: "Order tracking", notFound: "Ordern hittades inte", goHome: "Tillbaka till startsidan", order: "Beställning", currentStatus: "Nuvarande status", estimatedDelivery: "Beräknad leverans", trackCode: "Spårningskod", company: "Företag", items: "Produkter", total: "Totalt", support: "Support", notifications: "Meddelanden", deliveryProcess: "Leveransprocess", today: "Nu", cancelled: "Avbruten", returned: "Returnerad" },
}

function getStatusLabel(step, locale) {
  const key = 'label_' + locale
  return step[key] || step.label_en
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={40} className="text-[#ccff00] animate-spin" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [locale, setLocale] = useState('uz')
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('tenza_locale')
    if (saved) setLocale(saved)
  }, [])

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
      const found = orders.find(o => (o.orderId || o.id) === orderId)
      setOrder(found)
    }
  }, [orderId])

  const lang = L[locale] || L.uz

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white px-4">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-bold">{lang.notFound}</h2>
          <Link href="/" className="text-[#ccff00] mt-4 inline-block hover:underline">{lang.goHome}</Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status)
  const isTerminal = order.status === 'cancelled' || order.status === 'returned'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-bold text-lg">{lang.title}</h1>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">{lang.order}</p>
              <p className="text-white font-bold font-mono">#{order.orderId || order.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || statusColors.pending_verification}`}>
              {isTerminal
                ? (order.status === 'cancelled' ? `❌ ${lang.cancelled}` : `🔄 ${lang.returned}`)
                : `${statusSteps[currentStepIndex]?.icon} ${getStatusLabel(statusSteps[currentStepIndex], locale)}`}
            </span>
          </div>

          {order.tracking?.code && (
            <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{lang.trackCode}:</span>
                <span className="text-white font-mono">{order.tracking.code}</span>
              </div>
              {order.tracking.company && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{lang.company}:</span>
                  <span className="text-white">{order.tracking.company}</span>
                </div>
              )}
              {order.tracking.estimatedDelivery && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{lang.estimatedDelivery}:</span>
                  <span className="text-[#ccff00]">{order.tracking.estimatedDelivery}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-300">{(typeof item.name === 'string' ? item.name : item.name?.[locale] || item.name?.en || '')} x{item.quantity}</span>
                <span className="text-white">${(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-white/10">
              <span>{lang.total}</span>
              <span className="text-[#ccff00]">${(order.total || order.totalPrice || 0).toFixed(0)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-6">{lang.deliveryProcess}</h3>
          <div className="relative">
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isLast = index === statusSteps.length - 1
              const historyEntry = (order.history || []).find(h => h.status === step.key)

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-[#ccff00] border-[#ccff00]' : 'bg-transparent border-gray-600'}`}
                      animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                      transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}>
                      {isCompleted && <CheckCircle size={10} className="text-white" />}
                    </motion.div>
                    {!isLast && <div className={`w-0.5 h-10 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`} />}
                  </div>
                  <div className="pb-10">
                    <p className={`font-bold text-sm ${isCompleted ? 'text-green-400' : isCurrent ? 'text-[#ccff00]' : 'text-gray-500'}`}>
                      {step.icon} {getStatusLabel(step, locale)}
                    </p>
                    {historyEntry?.time && (
                      <p className="text-xs text-gray-600 mt-0.5">{new Date(historyEntry.time).toLocaleString()}</p>
                    )}
                    {isCurrent && !isTerminal && <p className="text-xs text-[#ccff00] mt-1 animate-pulse">● {lang.today}</p>}
                  </div>
                </div>
              )
            })}

            {order.status === 'cancelled' && (
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-500" />
                <div>
                  <p className="font-bold text-sm text-red-400">❌ {lang.cancelled}</p>
                  {order.history?.find(h => h.status === 'cancelled')?.time && (
                    <p className="text-xs text-gray-600">{new Date(order.history.find(h => h.status === 'cancelled').time).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}

            {order.status === 'returned' && (
              <div className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-gray-500" />
                <div>
                  <p className="font-bold text-sm text-gray-400">🔄 {lang.returned}</p>
                  {order.history?.find(h => h.status === 'returned')?.time && (
                    <p className="text-xs text-gray-600">{new Date(order.history.find(h => h.status === 'returned').time).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-3">
          <Link href={`/support?tab=chat&auto=${order.orderId || order.id}`}
            className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all">
            <MessageSquare size={20} /> {lang.support}
          </Link>
          <Link href="/notifications"
            className="w-full py-3 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-[#ccff00]/50 transition-all text-sm">
            <Package size={18} /> {lang.notifications}
          </Link>
        </div>
      </div>
    </div>
  )
}
