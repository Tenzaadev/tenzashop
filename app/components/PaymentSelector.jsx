'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const methods = {
  fi: [
    { id: 'stripe', label: { uz: 'Visa / Mastercard', ru: 'Visa / Mastercard', en: 'Visa / Mastercard', fi: 'Visa / Mastercard', sv: 'Visa / Mastercard' }, icon: '💳', color: 'bg-[#635BFF]/10 border-[#635BFF]/30', textColor: 'text-[#635BFF]' },
  ],
  uz: [
    { id: 'payme', label: { uz: 'Uzcard / Humo (Payme)', ru: 'Uzcard / Humo (Payme)', en: 'Uzcard / Humo (Payme)', fi: 'Uzcard / Humo (Payme)', sv: 'Uzcard / Humo (Payme)' }, icon: '💳', color: 'bg-white/[0.03] border-white/[0.08]', textColor: 'text-white' },
  ],
  ru: [
    { id: 'robokassa', label: { uz: 'Sberbank / T-Bank / Karta', ru: 'Сбербанк / Т-Банк / Карта', en: 'Sberbank / T-Bank / Card', fi: 'Sberbank / T-Bank / Kortti', sv: 'Sberbank / T-Bank / Kort' }, icon: '🏦', color: 'bg-white/[0.03] border-white/[0.08]', textColor: 'text-white' },
  ],
}

export default function PaymentSelector({ amount, orderId, country, locale, customerEmail, onPaid }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lang = locale || 'en'

  const handleStripe = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId, customerEmail, currency: 'eur' }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      if (data.url) { window.location.href = data.url }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handlePayme = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/payme-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handleRobokassa = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/robokassa-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId, description: `Order ${orderId}` }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      if (data.url) { window.location.href = data.url }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handlers = { stripe: handleStripe, payme: handlePayme, robokassa: handleRobokassa }

  const available = methods[country] || []

  return (
    <div className="space-y-3">
      {available.map(m => {
        const h = handlers[m.id]
        return (
          <button key={m.id} onClick={h} disabled={loading}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${m.color} hover:opacity-80 transition-all disabled:opacity-40`}>
            <span className="text-2xl">{m.icon}</span>
            <div className="flex-1 text-left">
              <p className={`font-bold text-sm ${m.textColor}`}>{m.label[lang] || m.label.en}</p>
              <p className="text-gray-500 text-xs">${Number(amount).toFixed(2)}</p>
            </div>
            {loading ? (
              <Loader2 size={18} className="animate-spin text-[#ccff00]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-700" />
            )}
          </button>
        )
      })}

      {country === 'fi' && error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-red-300 text-xs">{error}</p>
        </div>
      )}

      {!['fi', 'uz', 'ru'].includes(country) && (
        <div className="bg-yellow-500/[0.04] border border-yellow-500/15 rounded-xl p-4 text-center">
          <p className="text-yellow-200/80 text-xs">
            For delivery to this country, please contact @tenza_me on Telegram
          </p>
        </div>
      )}
    </div>
  )
}
