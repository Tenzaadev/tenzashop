'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BellOff, CheckCircle, XCircle, Trash2, Reply, Send, Loader2, MessageSquare, ExternalLink, Coins, Package } from 'lucide-react'
import { subscribeNotifications, markNotificationRead } from '@/lib/firestore'
import { useI18n } from '@/i18n'


const notifIcons = {
  confirmed: <CheckCircle className="text-green-400" size={24} />,
  cancelled: <XCircle className="text-red-400" size={24} />,
  support_reply: <MessageSquare className="text-blue-400" size={24} />,
  delivery_update: <Package className="text-purple-400" size={24} />,
}

const notifColors = {
  confirmed: 'border-l-green-500 bg-green-500/5',
  cancelled: 'border-l-red-500 bg-red-500/5',
  support_reply: 'border-l-blue-500 bg-blue-500/5',
  delivery_update: 'border-l-purple-500 bg-purple-500/5',
}

const L = {
  uz: {
    title: 'Bildirishnomalar', empty: "Bildirishnomalar yo'q",
    emptyDesc: "Buyurtma bersangiz, to'lov holati shu yerda ko'rinadi",
    markAllRead: "Hammasini o'qildi qilish",
    confirmed: "✅ To'lov tasdiqlandi!", cancelled: "❌ To'lov rad etildi",
    justNow: 'Hozir', minutesAgo: 'daq. oldin', hoursAgo: 'soat oldin', daysAgo: 'kun oldin',
    backToHome: 'Bosh sahifaga', orderId: 'Buyurtma', delete: "O'chirish",
    reply: "Javob yozish", replyPlaceholder: "Javobingizni yozing...", replySent: "✅ Javobingiz yuborildi!",
    support_reply: "Qo'llab-quvvatlashdan javob", supportDetails: "Batafsil",
    coinsUsed: "Ishlatilgan coin", coinsEarned: "Qo'shilgan coin", newBalance: "Yangi balans",
    replyToOrder: "Buyurtma haqida yozish",
    trackOrder: "Kuzatish",
    estimatedDelivery: "Yetkazish",
  },
  ru: {
    title: 'Уведомления', empty: 'Уведомлений нет',
    emptyDesc: 'Когда вы сделаете заказ, статус оплаты будет отображаться здесь',
    markAllRead: 'Отметить все прочитанными',
    confirmed: "✅ Оплата подтверждена!", cancelled: "❌ Оплата отклонена",
    justNow: 'Сейчас', minutesAgo: 'мин. назад', hoursAgo: 'ч. назад', daysAgo: 'дн. назад',
    backToHome: 'На главную', orderId: 'Заказ', delete: "Удалить",
    reply: "Написать ответ", replyPlaceholder: "Напишите ответ...", replySent: "✅ Ответ отправлен!",
    support_reply: 'Ответ от поддержки', supportDetails: 'Подробнее',
    coinsUsed: "Использовано монет", coinsEarned: "Добавлено монет", newBalance: "Новый баланс",
    replyToOrder: "Написать о заказе",
    trackOrder: "Отследить",
    estimatedDelivery: "Доставка",
  },
  en: {
    title: 'Notifications', empty: 'No notifications',
    emptyDesc: 'When you place an order, payment status will appear here',
    markAllRead: 'Mark all as read',
    confirmed: '✅ Payment confirmed!', cancelled: '❌ Payment rejected',
    justNow: 'Just now', minutesAgo: 'min ago', hoursAgo: 'h ago', daysAgo: 'd ago',
    backToHome: 'Back to home', orderId: 'Order', delete: "Delete",
    reply: "Write a reply", replyPlaceholder: "Write your reply...", replySent: "✅ Reply sent!",
    support_reply: 'Support reply', supportDetails: 'Details',
    coinsUsed: "Coins used", coinsEarned: "Coins earned", newBalance: "New balance",
    replyToOrder: "Write about order",
    trackOrder: "Track",
    estimatedDelivery: "Delivery",
  },
  fi: {
    title: 'Ilmoitukset', empty: 'Ei ilmoituksia',
    emptyDesc: 'Kun teet tilauksen, maksun tila näkyy täällä',
    markAllRead: 'Merkitse kaikki luetuksi',
    confirmed: '✅ Maksu vahvistettu!', cancelled: '❌ Maksu hylätty',
    justNow: 'Juuri nyt', minutesAgo: 'min sitten', hoursAgo: 't sitten', daysAgo: 'pv sitten',
    backToHome: 'Takaisin etusivulle', orderId: 'Tilaus', delete: "Poista",
    reply: "Kirjoita vastaus", replyPlaceholder: "Kirjoita vastauksesi...", replySent: "✅ Vastaus lähetetty!",
    support_reply: 'Tuen vastaus', supportDetails: 'Lisätiedot',
    coinsUsed: "Käytetyt kolikot", coinsEarned: "Kolikot lisätty", newBalance: "Uusi saldo",
    replyToOrder: "Kirjoita tilauksesta",
    trackOrder: "Seuraa",
    estimatedDelivery: "Toimitus",
  },
  sv: {
    title: 'Meddelanden', empty: 'Inga meddelanden',
    emptyDesc: 'När du lägger en beställning visas betalningsstatus här',
    markAllRead: 'Markera alla som lästa',
    confirmed: '✅ Betalning bekräftad!', cancelled: '❌ Betalning avvisad',
    justNow: 'Nyss', minutesAgo: 'min sedan', hoursAgo: 'tim sedan', daysAgo: 'd sedan',
    backToHome: 'Tillbaka till startsidan', orderId: 'Beställning', delete: "Ta bort",
    reply: "Skriv svar", replyPlaceholder: "Skriv ditt svar...", replySent: "✅ Svar skickat!",
    support_reply: 'Support-svar', supportDetails: 'Detaljer',
    coinsUsed: "Använda mynt", coinsEarned: "Mynt tillagda", newBalance: "Ny saldo",
    replyToOrder: "Skriv om ordern",
    trackOrder: "Spåra",
    estimatedDelivery: "Leverans",
  },
}

function getTimeAgo(date, lang) {
  const ms = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} ${lang.daysAgo}`
  if (hours > 0) return `${hours} ${lang.hoursAgo}`
  if (minutes > 0) return `${minutes} ${lang.minutesAgo}`
  return lang.justNow
}

export default function NotificationsPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const lang = L[locale] || L.uz
  const [notifs, setNotifs] = useState([])
  const [userEmail, setUserEmail] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let email = localStorage.getItem('tenza_user_email')
    if (!email) {
      try {
        const cu = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
        if (cu?.login) email = cu.login
      } catch {}
    }
    if (!email) email = 'guest@tenza.shop'
    setUserEmail(email)
    const unsub = subscribeNotifications((data) => {
      setNotifs(data.filter(n => n.email === email))
    })
    return () => unsub()
  }, [])

  const handleMarkAllRead = async () => {
    try {
      const notifs = JSON.parse(localStorage.getItem('tenza_notifications') || '{}')
      if (notifs[userEmail]) {
        notifs[userEmail] = notifs[userEmail].map(n => ({ ...n, read: true }))
        localStorage.setItem('tenza_notifications', JSON.stringify(notifs))
        window.dispatchEvent(new CustomEvent('notifications-updated'))
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch {}
  }

  const handleClick = async (notifId) => {
    await markNotificationRead(notifId)
    setExpanded(expanded === notifId ? null : notifId)
  }

  const goToSupport = (notif) => {
    localStorage.setItem('tenza_user_email', userEmail)
    if (notif.type === 'support_reply' && notif.supportMessageId) {
      router.push('/support?tab=chat&msg=' + notif.supportMessageId)
    } else if (notif.orderId) {
      router.push('/support?tab=chat&auto=' + notif.orderId)
    }
  }

  const handleDelete = async (e, notifId) => {
    e.stopPropagation()
    try {
      const notifs = JSON.parse(localStorage.getItem('tenza_notifications') || '{}')
      Object.keys(notifs).forEach(email => {
        notifs[email] = (notifs[email] || []).filter(n => n.id !== notifId)
      })
      localStorage.setItem('tenza_notifications', JSON.stringify(notifs))
      window.dispatchEvent(new CustomEvent('notifications-updated'))
    } catch {}
    setExpanded(null)
  }

  const getTitle = (notif) => notif.title || lang[notif.type] || lang.confirmed

  const getDesc = (notif) => {
    if (notif.type === 'support_reply') return notif.message || ''
    return notif.message || ''
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="text-lg font-bold">{lang.title}</h1>
          <button onClick={handleMarkAllRead} className="text-sm text-[#ccff00] hover:text-white transition-colors">
            {lang.markAllRead}
          </button>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 max-w-2xl mx-auto">
        {notifs.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <BellOff className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-400 mb-2">{lang.empty}</h2>
            <p className="text-gray-500">{lang.emptyDesc}</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifs.map(notif => {
              const isRead = notif.read
              const color = notifColors[notif.type] || notifColors.confirmed
              const showCoinInfo = notif.type === 'confirmed' && (notif.coinsUsed > 0 || notif.coinsEarned > 0)
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleClick(notif.id)}
                  className={`border-l-4 rounded-r-2xl p-4 cursor-pointer transition-all hover:bg-white/5 ${color} ${isRead ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{notifIcons[notif.type] || notifIcons.confirmed}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold ${isRead ? 'text-gray-400' : 'text-white'}`}>
                          {getTitle(notif)}
                        </h3>
                        {!isRead && <span className="w-2 h-2 bg-[#ccff00] rounded-full flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {expanded === notif.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="text-gray-400 text-sm mt-1">{getDesc(notif)}</p>
                            {notif.orderId && (
                              <p className="text-gray-500 text-xs mt-1">
                                {lang.orderId}: <span className="text-[#ccff00] font-mono">#{notif.orderId}</span>
                              </p>
                            )}
                            {showCoinInfo && (
                              <div className="flex flex-wrap items-center gap-3 mt-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                                <Coins size={14} className="text-orange-400" />
                                {notif.coinsUsed > 0 && (
                                  <span className="text-xs text-orange-300">
                                    {lang.coinsUsed}: <span className="font-bold">-{notif.coinsUsed}</span>
                                  </span>
                                )}
                                {notif.coinsEarned > 0 && (
                                  <span className="text-xs text-green-400">
                                    {lang.coinsEarned}: <span className="font-bold">+{notif.coinsEarned}</span>
                                  </span>
                                )}
                                {notif.newBalance !== undefined && (
                                  <span className="text-xs text-[#ccff00]">
                                    {lang.newBalance}: <span className="font-bold">{notif.newBalance}</span>
                                  </span>
                                )}
                              </div>
                            )}
                            {notif.type === 'support_reply' && (
                              <button onClick={(e) => { e.stopPropagation(); goToSupport(notif) }}
                                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 mb-2 transition-colors">
                                <ExternalLink size={12} /> {lang.supportDetails}
                              </button>
                            )}
                            {notif.type !== 'support_reply' && notif.orderId && (
                              <button onClick={(e) => { e.stopPropagation(); goToSupport(notif) }}
                                className="inline-flex items-center gap-1 text-xs text-[#ccff00] hover:text-white mt-2 mb-2 transition-colors">
                                <MessageSquare size={12} /> {lang.replyToOrder}
                              </button>
                            )}
                            {notif.type !== 'support_reply' && notif.orderId && notif.type !== 'delivery_update' && (
                              <Link href={`/tracking?order=${notif.orderId}`} onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2 mb-2 transition-colors">
                                <Package size={12} />                                 {lang.trackOrder}
                              </Link>
                            )}
                            {notif.type === 'delivery_update' && notif.tracking?.code && (
                              <div className="bg-white/5 rounded-lg p-2 mt-2 space-y-1">
                                <p className="text-xs text-gray-400">Track: <span className="text-white font-mono">{notif.tracking.code}</span></p>
                                {notif.tracking.company && <p className="text-xs text-gray-400">{notif.tracking.company}</p>}
                                {notif.tracking.estimatedDelivery && <p className="text-xs text-[#ccff00]">{lang.estimatedDelivery}: {notif.tracking.estimatedDelivery}</p>}
                              </div>
                            )}
                            {notif.type === 'delivery_update' && notif.orderId && (
                              <Link href={`/tracking?order=${notif.orderId}`} onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2 mb-2 transition-colors">
                                <Package size={12} /> {lang.trackOrder}
                              </Link>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={(e) => handleDelete(e, notif.id)}
                                className="flex items-center gap-1 text-gray-600 hover:text-red-400 transition-colors text-xs">
                                <Trash2 size={12} /> {lang.delete}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); goToSupport(notif) }}
                                className="flex items-center gap-1 text-gray-500 hover:text-[#ccff00] transition-colors text-xs">
                                <Reply size={12} /> {lang.reply}
                              </button>
                              </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-gray-600 text-xs mt-1">{getTimeAgo(notif.createdAt, lang)}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
