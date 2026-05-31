'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock, Bell, Home, ArrowRight, Loader2,
  Coins, Package, CreditCard, CheckCircle, QrCode
} from 'lucide-react'
import { useI18n } from '@/i18n'
import { getAllOrders } from '@/lib/firestore'

const L = {
  uz: {
    title: "Buyurtma qabul qilindi!", orderId: "Buyurtma ID",
    verifying: "To'lovingiz tekshirilmoqda",
    willNotify: "Admin to'lovni tasdiqlagach, sizga xabar beramiz",
    checkNotifications: "Bildirishnomalar sahifasida to'lov holatini kuzatishingiz mumkin",
    goHome: "Bosh sahifaga qaytish",
    viewNotifications: "Bildirishnomalarni ko'rish",
    coinProcess: "Agar coin ishlatgan bo'lsangiz, ular admin tomonidan tasdiqlangandan so'ng hisobdan yechiladi",
    coinBonus: "Loyalty bonus coin'lar ham tasdiqlashdan keyin beriladi",
    trackOrder: "Buyurtmani kuzatish",
    paymentInfo: "To'lov ma'lumotlari",
    paymentPending: "To'lov kutilmoqda",
    paymentMethod: "To'lov usuli",
    orderEmail: "Email manzil",
    orderAmount: "Buyurtma summasi",
    paidWithCoins: "Coin bilan to'landi",
    waiting: "Admin tekshirishi kutilmoqda",
    support: "Qo'llab-quvvatlash",
  },
  ru: {
    title: "Заказ принят!", orderId: "Номер заказа",
    verifying: "Платёж проверяется",
    willNotify: "Мы сообщим вам, когда администратор подтвердит оплату",
    checkNotifications: "Вы можете отслеживать статус в уведомлениях",
    goHome: "На главную",
    viewNotifications: "Смотреть уведомления",
    coinProcess: "Если вы использовали монеты, они будут списаны после подтверждения администратором",
    coinBonus: "Бонусные монеты лояльности также начисляются после подтверждения",
    trackOrder: "Отследить заказ",
    paymentInfo: "Информация об оплате",
    paymentPending: "Оплата ожидается",
    paymentMethod: "Способ оплаты",
    orderEmail: "Email адрес",
    orderAmount: "Сумма заказа",
    paidWithCoins: "Оплачено монетами",
    waiting: "Ожидание проверки администратором",
    support: "Поддержка",
  },
  en: {
    title: "Order Received!", orderId: "Order ID",
    verifying: "Payment is being verified",
    willNotify: "We'll notify you once admin confirms your payment",
    checkNotifications: "You can track payment status in notifications",
    goHome: "Go Home",
    viewNotifications: "View Notifications",
    coinProcess: "If you used coins, they will be deducted after admin confirmation",
    coinBonus: "Loyalty bonus coins are also awarded after confirmation",
    trackOrder: "Track order",
    paymentInfo: "Payment Information",
    paymentPending: "Payment pending",
    paymentMethod: "Payment Method",
    orderEmail: "Email Address",
    orderAmount: "Order Amount",
    paidWithCoins: "Paid with coins",
    waiting: "Waiting for admin verification",
    support: "Support",
  },
  fi: {
    title: "Tilaus vastaanotettu!", orderId: "Tilausnumero",
    verifying: "Maksua tarkistetaan",
    willNotify: "Ilmoitamme sinulle, kun ylläpitäjä vahvistaa maksun",
    checkNotifications: "Voit seurata maksun tilaa ilmoituksissa",
    goHome: "Takaisin etusivulle",
    viewNotifications: "Katso ilmoituksia",
    coinProcess: "Jos käytit kolikoita, ne vähennetään ylläpitäjän vahvistuksen jälkeen",
    coinBonus: "Kanta-asiakasbonuskolikot myönnetään myös vahvistuksen jälkeen",
    trackOrder: "Seuraa tilausta",
    paymentInfo: "Maksutiedot",
    paymentPending: "Maksu odottaa",
    paymentMethod: "Maksutapa",
    orderEmail: "Sähköpostiosoite",
    orderAmount: "Tilauksen summa",
    paidWithCoins: "Maksettu kolikoilla",
    waiting: "Odotetaan ylläpitäjän vahvistusta",
    support: "Tuki",
  },
  sv: {
    title: "Beställning mottagen!", orderId: "Beställningsnummer",
    verifying: "Betalning verifieras",
    willNotify: "Vi meddelar dig när admin bekräftar din betalning",
    checkNotifications: "Du kan följa betalningsstatus i meddelanden",
    goHome: "Tillbaka till startsidan",
    viewNotifications: "Visa meddelanden",
    coinProcess: "Om du använde mynt dras de efter admin-bekräftelse",
    coinBonus: "Lojalitetsbonusmynt ges också efter bekräftelse",
    trackOrder: "Spåra order",
    paymentInfo: "Betalningsinformation",
    paymentPending: "Betalning väntar",
    paymentMethod: "Betalningsmetod",
    orderEmail: "E-postadress",
    orderAmount: "Beställningsbelopp",
    paidWithCoins: "Betald med mynt",
    waiting: "Väntar på admin-verifiering",
    support: "Support",
  },
}

function SuccessContent() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') || 'UNKNOWN'
  const userEmail = searchParams.get('email') || ''
  const sessionId = searchParams.get('session_id') || ''
  const [order, setOrder] = useState(null)
  const [paymentVerified, setPaymentVerified] = useState(false)

  useEffect(() => {
    if (userEmail) localStorage.setItem('tenza_user_email', userEmail)
    ;(async () => {
      try {
        const orders = await getAllOrders()
        const found = orders.find(o => (o.id || o.orderId) === orderId)
        if (found) setOrder(found)
      } catch {}
    })()
    if (sessionId && orderId !== 'UNKNOWN') {
      ;(async () => {
        try {
          const res = await fetch(`/api/stripe-payment?sessionId=${sessionId}`)
          const data = await res.json()
          if (data.paid) {
            setPaymentVerified(true)
            const orders = await getAllOrders()
            const found = orders.find(o => (o.id || o.orderId) === orderId)
            if (found) {
              found.status = 'paid'
              found.paidAt = new Date().toISOString()
              found.paymentMethod = 'stripe'
              found.history = [...(found.history || []), { status: 'paid', time: new Date().toISOString(), note: 'Stripe checkout verified' }]
              localStorage.setItem('tenza_orders', JSON.stringify(orders))
              fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: 'paid' }) }).catch(() => {})
              setOrder({ ...found })
            }
          }
        } catch {}
      })()
    }
  }, [orderId, userEmail, sessionId])

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="text-center max-w-lg w-full"
      >
        <div className="relative mb-8">
          {paymentVerified ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle size={48} className="text-green-400" />
            </motion.div>
          ) : (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl inline-block">
              <span className="relative">
                <Clock className="w-24 h-24 text-[#ccff00] mx-auto" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-dashed border-[#ccff00]/30 rounded-full" />
                </motion.div>
              </span>
            </motion.div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{lang.title}</h1>

        {orderId !== 'UNKNOWN' && (
          <p className="text-gray-400 mb-6 text-sm">
            {lang.orderId}: <span className="text-[#ccff00] font-bold font-mono text-lg">#{orderId}</span>
          </p>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${paymentVerified ? 'bg-green-500/10 border-green-400/30' : 'bg-gradient-to-br from-[#ccff00]/5 to-yellow-500/5 border-2 border-[#ccff00]/20'} rounded-3xl p-6 mb-4`}
        >
          {paymentVerified ? (
            <>
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-green-400 mb-2">To'lov tasdiqlandi! ✅</h2>
              <p className="text-green-200/80 text-sm leading-relaxed">Stripe to'lovi muvaffaqiyatli o'tdi. Buyurtmangiz admin tomonidan ko'rib chiqiladi.</p>
            </>
          ) : (
            <>
              <Clock className="w-10 h-10 text-[#ccff00] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white mb-2">{lang.verifying}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{lang.willNotify}</p>
            </>
          )}
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 mb-4"
        >
          <h3 className="text-sm font-bold text-[#ccff00] mb-3 flex items-center gap-2 justify-center">
            <CreditCard size={16} /> {lang.paymentInfo}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{lang.paymentMethod}</span>
              <span className="text-white">
                {order?.paymentMethod === 'coins' ? <>🪙 {lang.paidWithCoins}</> : order?.paymentMethod === 'combined' ? '🪙 + 💳' : order?.paymentMethod === 'stripe' ? '💳 Visa / Mastercard' : '💳 Sberbank QR'}
              </span>
            </div>
            {order?.coinsUsed > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">{lang.paidWithCoins}</span>
                <span className="text-yellow-400">{order.coinsUsed} coin</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">{lang.orderAmount}</span>
              <span className="text-[#ccff00] font-bold">${(order?.total || 0).toFixed(2)}</span>
            </div>
            {userEmail && (
              <div className="flex justify-between">
                <span className="text-gray-400">{lang.orderEmail}</span>
                <span className="text-gray-300 text-xs">{userEmail}</span>
              </div>
            )}
          </div>
        </motion.div>

        {order?.coinsUsed > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border-2 border-orange-500/20 rounded-3xl p-5 mb-6"
          >
            <Coins className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm leading-relaxed mb-1">{lang.coinProcess}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{lang.coinBonus}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          <Link href="/notifications"
            className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all text-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.3)]">
            <Bell size={20} /> {lang.viewNotifications} <ArrowRight size={20} />
          </Link>
          {orderId !== 'UNKNOWN' && (
            <Link href={`/tracking?order=${orderId}`}
              className="w-full py-3 border border-[#ccff00]/30 text-[#ccff00] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#ccff00]/10 transition-all">
              <Package size={18} /> {lang.trackOrder} &rarr;
            </Link>
          )}
          <Link href={`/support?autoId=${orderId}&email=${encodeURIComponent(userEmail)}`}
            className="w-full py-3 border border-white/10 text-gray-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-[#ccff00]/50 transition-all">
            <span>💬</span> {lang.support}
          </Link>
          <Link href="/"
            className="w-full py-3 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:border-[#ccff00]/50 transition-all">
            <Home size={20} /> {lang.goHome}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 size={40} className="text-[#ccff00] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
