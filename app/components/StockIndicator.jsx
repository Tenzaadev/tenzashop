'use client'
import { useI18n } from '@/i18n'

const L = {
  uz: {
    outOfStock: 'Tugagan',
    lastPieces: 'Oxirgi {n} dona!',
    inStock: 'Sotuvda {n} dona bor',
    available: 'Sotuvda mavjud',
    sold: '{n} ta sotilgan',
  },
  ru: {
    outOfStock: 'Нет в наличии',
    lastPieces: 'Последние {n} шт.!',
    inStock: 'В наличии {n} шт.',
    available: 'В наличии',
    sold: '{n} продано',
  },
  en: {
    outOfStock: 'Out of stock',
    lastPieces: 'Last {n} pieces!',
    inStock: '{n} in stock',
    available: 'In stock',
    sold: '{n} sold',
  },
  fi: {
    outOfStock: 'Loppu',
    lastPieces: 'Viimeiset {n} kpl!',
    inStock: '{n} varastossa',
    available: 'Varastossa',
    sold: '{n} myyty',
  },
  sv: {
    outOfStock: 'Slutsåld',
    lastPieces: 'Sista {n} st!',
    inStock: '{n} i lager',
    available: 'I lager',
    sold: '{n} sålda',
  },
}

export function StockIndicator({ stock, locale: forcedLocale }) {
  const { locale: ctxLocale } = useI18n()
  const loc = forcedLocale || ctxLocale
  const ll = L[loc] || L.uz

  if (stock === 0) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
        <span className="text-red-400 text-xs font-medium">{ll.outOfStock}</span>
      </div>
    )
  }
  if (stock <= 5) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
        <span className="text-yellow-400 text-xs font-medium">{ll.lastPieces.replace('{n}', stock)}</span>
      </div>
    )
  }
  if (stock <= 20) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
        <span className="text-gray-400 text-xs">{ll.inStock.replace('{n}', stock)}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
      <span className="text-gray-400 text-xs">{ll.available}</span>
    </div>
  )
}

export function SoldCount({ sold, locale: forcedLocale }) {
  const { locale: ctxLocale } = useI18n()
  const loc = forcedLocale || ctxLocale
  const ll = L[loc] || L.uz
  if (!sold || sold <= 0) return null
  return <span className="text-gray-500 text-xs">{ll.sold.replace('{n}', sold)}</span>
}
