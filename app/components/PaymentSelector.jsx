'use client'
import { useState, useEffect } from 'react'
import { QrCode, CreditCard, Loader2, Check, ExternalLink, Timer } from 'lucide-react'
import { useI18n } from '@/i18n'

export default function PaymentSelector({ amount, orderId, country, currency, customerEmail, onPaid, onError }) {
  const { t } = useI18n()
  const [method, setMethod] = useState('')
  const [qrCode, setQrCode] = useState(null)
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [status, setStatus] = useState('')
  const [paid, setPaid] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1200)

  useEffect(() => {
    if (!polling) return
    const interval = setInterval(async () => {
      try {
        let endpoint = ''
        if (country === 'ru') endpoint = `/api/sber-payment?orderId=${orderId}`
        else if (country === 'uz') endpoint = `/api/payme-payment?orderId=${orderId}`

        if (!endpoint) { clearInterval(interval); return }

        const res = await fetch(endpoint)
        const data = await res.json()

        if (data.paid) {
          clearInterval(interval)
          setPaid(true)
          setStatus(t('paid') || 'Paid ✅')
          if (onPaid) onPaid()
        }
      } catch (e) {
        console.error('Poll error:', e)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [polling, orderId, country, onPaid, t])

  useEffect(() => {
    if (status) return
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [status])

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const handleStripe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: currency || 'eur', orderId, customerEmail })
      })
      const data = await res.json()
      if (data.url) {
        setCheckoutUrl(data.url)
        setStatus(t('redirecting') || 'Redirecting to Stripe...')
        window.location.href = data.url
      }
    } catch (e) {
      if (onError) onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayme = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payme-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl)
        setPolling(true)
        setStatus(t('redirecting') || 'Redirecting to Payme...')
        window.location.href = data.checkoutUrl
      }
    } catch (e) {
      if (onError) onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSber = async (methodType) => {
    setLoading(true)
    try {
      const res = await fetch('/api/sber-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId, description: `Заказ ${orderId}`, method: methodType })
      })
      const data = await res.json()
      if (data.qrCode) {
        setQrCode(data.qrCode)
        setMethod(methodType)
        setPolling(true)
        setStatus(t('scan_qr') || 'Scan QR code with your bank app')
      }
    } catch (e) {
      if (onError) onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const countryMethods = {
    fi: [
      { id: 'stripe', label: 'Visa / Mastercard', icon: '💳', color: 'blue', action: handleStripe },
    ],
    uz: [
      { id: 'payme', label: 'Uzcard / Humo (Payme)', icon: '💳', color: 'green', action: handlePayme },
    ],
    ru: [
      { id: 'sberbank', label: t('sberbank') || 'Сбербанк QR', icon: '📱', color: 'green', action: () => handleSber('sberbank') },
      { id: 'tbank', label: t('tbank') || 'Т-Банк', icon: '📱', color: 'yellow', action: () => handleSber('tbank') },
    ],
  }

  const methods = countryMethods[country] || countryMethods.fi

  if (paid) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-400" />
        </div>
        <p className="text-white text-xl font-bold mb-2">{t('payment_success') || 'Payment successful! ✅'}</p>
        <p className="text-gray-400 text-sm">{t('payment_verified') || 'Payment verified automatically'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {methods.map(m => (
        <button key={m.id} onClick={m.action} disabled={loading || polling}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all disabled:opacity-40 ${
            method === m.id
              ? 'border-[#ccff00] bg-[#ccff00]/5 shadow-[0_0_15px_rgba(204,255,0,0.05)]'
              : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
          }`}>
          <span className="text-2xl">{m.icon}</span>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-sm">{m.label}</p>
            <p className="text-gray-500 text-xs">${amount.toFixed(2)}</p>
          </div>
          {loading && method === m.id ? (
            <Loader2 size={18} className="text-[#ccff00] animate-spin" />
          ) : (
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              method === m.id ? 'border-[#ccff00]' : 'border-gray-700'
            }`}>
              {method === m.id && <div className="w-3 h-3 rounded-full bg-[#ccff00]" />}
            </div>
          )}
        </button>
      ))}

      {qrCode && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <QrCode size={20} className="text-[#ccff00]" />
            <span className="text-white font-bold">
              {method === 'sberbank' ? 'Сбербанк' : 'Т-Банк'} QR
            </span>
          </div>
          <img src={qrCode} alt="QR code" className="w-56 h-56 mx-auto rounded-xl bg-white p-2" />
          <div className="flex items-center justify-center gap-2 text-white font-mono">
            <Timer size={16} className="text-[#ccff00]" />
            <span className={timeLeft < 120 ? 'text-red-400' : 'text-white'}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{t('scan_with_app') || 'Scan with your banking app'}</p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-yellow-200 text-xs">
              {t('payment_pending') || 'Waiting for payment... Auto-checks every 5 seconds'}
            </p>
          </div>
        </div>
      )}

      {checkoutUrl && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <ExternalLink size={24} className="text-[#ccff00] mx-auto" />
          <p className="text-white font-bold">{t('redirected') || 'Redirected to payment page'}</p>
          <p className="text-gray-400 text-sm">{t('complete_payment') || 'Complete payment in the opened window'}</p>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all">
            {t('open_payment') || 'Open payment page'}
          </a>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-yellow-200 text-xs">
              {t('payment_pending') || 'Waiting for payment... Auto-checks every 5 seconds'}
            </p>
          </div>
        </div>
      )}

      {status && !qrCode && !checkoutUrl && (
        <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center`}>
          <p className="text-yellow-200 text-sm">{status}</p>
        </div>
      )}
    </div>
  )
}
