'use client'

const methods = {
  fi: [{ id: 'stripe', label: { uz: 'Visa / Mastercard', ru: 'Visa / Mastercard', en: 'Visa / Mastercard', fi: 'Visa / Mastercard', sv: 'Visa / Mastercard' }, icon: '💳' }],
  uz: [{ id: 'payme', label: { uz: 'Uzcard / Humo (Payme)', ru: 'Uzcard / Humo (Payme)', en: 'Uzcard / Humo (Payme)', fi: 'Uzcard / Humo (Payme)', sv: 'Uzcard / Humo (Payme)' }, icon: '💳' }],
  ru: [{ id: 'robokassa', label: { uz: 'Sberbank / T-Bank / Karta', ru: 'Сбербанк / Т-Банк / Карта', en: 'Sberbank / T-Bank / Card', fi: 'Sberbank / T-Bank / Kortti', sv: 'Sberbank / T-Bank / Kort' }, icon: '🏦' }],
}

export default function PaymentSelector({ country, amount, locale }) {
  const lang = locale || 'en'
  const available = methods[country] || []

  if (!['fi', 'uz', 'ru'].includes(country)) {
    return (
      <div className="bg-yellow-500/[0.04] border border-yellow-500/15 rounded-xl p-4 text-center">
        <p className="text-yellow-200/80 text-xs">
          For delivery to this country, please contact @tenza_me on Telegram
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {available.map(m => (
        <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <span className="text-2xl">{m.icon}</span>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-sm">{m.label[lang] || m.label.en}</p>
            <p className="text-gray-500 text-xs">${Number(amount).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
