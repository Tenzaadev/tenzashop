'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, QrCode, Timer, Clock, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { sendTelegramMessage } from '@/utils/telegram'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/hooks/useLoyalty'
import Header from '../../components/Header'

export default function SberPaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const { t, formatPrice } = useI18n()
  const { user, addPurchaseBonus } = useAuth()
  const { useCoins } = useLoyalty()

  const [orderData, setOrderData] = useState(null)
  const [timeLeft, setTimeLeft] = useState(1200)
  const [payStatus, setPayStatus] = useState('waiting')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('tenza_order')
    if (!saved) { router.push('/checkout'); return }
    setOrderData(JSON.parse(saved))
  }, [router])

  useEffect(() => {
    if (payStatus !== 'waiting') return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [payStatus])

  const handleConfirmPaid = async () => {
    setConfirmLoading(true)
    try {
      const orderId = 'TENZA-' + Date.now().toString(36).toUpperCase()
      const orderWithId = {
        ...orderData,
        orderId,
        date: new Date().toISOString(),
        status: 'pending_verification',
        paymentMethod: 'sberbank_qr',
        login: user?.login,
      }

      const orders = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
      orders.push(orderWithId)
      localStorage.setItem('tenza_orders', JSON.stringify(orders))
      localStorage.removeItem('tenza_order')
      clearCart()

      if (orderData.coinsUsed > 0) {
        useCoins(orderData.coinsUsed)
      }

      const email = orderData.email || user?.email || 'guest@tenza.shop'
      localStorage.setItem('tenza_user_email', email)

      await sendTelegramMessage({
        ...orderWithId,
        adminNote: '🆕 YANGI BUYURTMA — TO\'LOV KUTILMOQDA',
        message: `Yangi buyurtma #${orderId}\n\nAdmin panelga kiring va to'lovni tasdiqlang: /admin`,
      })
      setPayStatus('paid')
      setTimeout(() => router.push(`/success?order=${orderId}&email=${email}`), 1500)
    } catch (e) {
      console.error('Confirm error:', e)
      setConfirmLoading(false)
    }
  }

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 size={40} className="text-[#ccff00] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4">
          <button onClick={() => router.push('/checkout')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
            <ArrowLeft size={18} /> {t('back')}
          </button>

          <h1 className="text-3xl font-black text-white mb-2">{t('payment')}</h1>
          <p className="text-gray-400 mb-8">{t('total')}: <span className="text-[#ccff00] font-bold text-xl">{formatPrice(orderData.totalPrice)}</span></p>

          {payStatus === 'paid' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-10 text-center">
              <Clock size={64} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-white text-2xl font-bold mb-2">To'lovingiz ko'rib chiqilmoqda</p>
              <p className="text-gray-400">Sizga sayt orqali bildirishnoma keladi</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <QrCode size={24} className="text-[#ccff00]" />
                <h2 className="text-white text-xl font-bold">Sberbank QR</h2>
              </div>

              <img src="/images/sber-qr.png" alt="Sberbank QR"
                className="w-64 h-64 mx-auto rounded-xl bg-white p-2 mb-6 object-contain" />

              <div className="flex items-center justify-center gap-2 text-white font-mono text-xl mb-3">
                <Timer size={20} className="text-[#ccff00]" />
                <span className={timeLeft < 120 ? 'text-red-400' : 'text-white'}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Sberbank ilovasida QR-kodni skanerlang va to'lovni amalga oshiring
              </p>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-4 text-left">
                <p className="text-gray-500 text-xs">To'lov qabul qiluvchi:</p>
                <p className="text-white text-sm font-medium">Рузматов Жавохирбек Умидбек угли</p>
                <p className="text-gray-400 text-xs">Сбербанк</p>
              </div>

              <label className="flex items-start gap-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  className="mt-0.5 accent-[#ccff00] w-4 h-4" />
                <span className="text-gray-300 text-sm leading-tight">
                  Men <strong className="text-white">Жавохирбек Рузматов</strong>ga Sberbank orqali <strong className="text-[#ccff00]">{formatPrice(orderData.totalPrice)}</strong> to'lovni amalga oshirdim
                </span>
              </label>

              <button onClick={handleConfirmPaid} disabled={!confirmed || confirmLoading}
                className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                {confirmLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                {confirmLoading ? 'Tekshirilmoqda...' : "To'ladim ✅"}
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
