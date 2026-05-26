'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Bell, Mail, Clock } from 'lucide-react'
import { subscribeNotifications, addNotification, getAllUsers } from '@/lib/firestore'
import { useI18n } from '@/i18n'

const L = {
  uz: {
    pageTitle: "Bildirishnomalar", subtitle: "Foydalanuvchilarga bildirishnoma yuborish",
    emailLabel: "Foydalanuvchi email", emailPlaceholder: "Email manzilini kiriting",
    msgLabel: "Xabar", msgPlaceholder: "Bildirishnoma matnini yozing...",
    typeLabel: "Tur",
    typeOptions: { confirmed: "Tasdiqlangan", cancelled: "Bekor qilingan", info: "Ma'lumot", promo: "Aksiya" },
    send: "Yuborish", sending: "Yuborilmoqda...",
    success: "Bildirishnoma yuborildi!", sentHistory: "Yuborilgan bildirishnomalar",
    noHistory: "Hali bildirishnomalar yuborilmagan",
    date: "Sana", email: "Email", type: "Tur", status: "Holat", sent: "Yuborilgan",
    emailNotFound: "Email topilmadi", userNotFound: "Foydalanuvchi topilmadi",
  },
  ru: {
    pageTitle: "Уведомления", subtitle: "Отправка уведомлений пользователям",
    emailLabel: "Email пользователя", emailPlaceholder: "Введите email адрес",
    msgLabel: "Сообщение", msgPlaceholder: "Напишите текст уведомления...",
    typeLabel: "Тип",
    typeOptions: { confirmed: "Подтверждён", cancelled: "Отменён", info: "Информация", promo: "Акция" },
    send: "Отправить", sending: "Отправляется...",
    success: "Уведомление отправлено!", sentHistory: "Отправленные уведомления",
    noHistory: "Уведомления ещё не отправлялись",
    date: "Дата", email: "Email", type: "Тип", status: "Статус", sent: "Отправлено",
    emailNotFound: "Email не найден", userNotFound: "Пользователь не найден",
  },
  en: {
    pageTitle: "Notifications", subtitle: "Send notifications to users",
    emailLabel: "User email", emailPlaceholder: "Enter email address",
    msgLabel: "Message", msgPlaceholder: "Write notification message...",
    typeLabel: "Type",
    typeOptions: { confirmed: "Confirmed", cancelled: "Cancelled", info: "Info", promo: "Promo" },
    send: "Send", sending: "Sending...",
    success: "Notification sent!", sentHistory: "Sent notifications",
    noHistory: "No notifications sent yet",
    date: "Date", email: "Email", type: "Type", status: "Status", sent: "Sent",
    emailNotFound: "Email not found", userNotFound: "User not found",
  },
  fi: {
    pageTitle: "Ilmoitukset", subtitle: "Lähetä ilmoituksia käyttäjille",
    emailLabel: "Käyttäjän sähköposti", emailPlaceholder: "Syötä sähköpostiosoite",
    msgLabel: "Viesti", msgPlaceholder: "Kirjoita ilmoitusviesti...",
    typeLabel: "Tyyppi",
    typeOptions: { confirmed: "Vahvistettu", cancelled: "Peruutettu", info: "Tieto", promo: "Tarjous" },
    send: "Lähetä", sending: "Lähetetään...",
    success: "Ilmoitus lähetetty!", sentHistory: "Lähetetyt ilmoitukset",
    noHistory: "Ilmoituksia ei ole vielä lähetetty",
    date: "Päiväys", email: "Sähköposti", type: "Tyyppi", status: "Tila", sent: "Lähetetty",
    emailNotFound: "Sähköpostia ei löydy", userNotFound: "Käyttäjää ei löydy",
  },
  sv: {
    pageTitle: "Notifieringar", subtitle: "Skicka notifieringar till användare",
    emailLabel: "Användarens e-post", emailPlaceholder: "Ange e-postadress",
    msgLabel: "Meddelande", msgPlaceholder: "Skriv notifieringsmeddelande...",
    typeLabel: "Typ",
    typeOptions: { confirmed: "Bekräftad", cancelled: "Avbruten", info: "Info", promo: "Erbjudande" },
    send: "Skicka", sending: "Skickar...",
    success: "Notifiering skickad!", sentHistory: "Skickade notifieringar",
    noHistory: "Inga notifieringar skickade än",
    date: "Datum", email: "E-post", type: "Typ", status: "Status", sent: "Skickad",
    emailNotFound: "E-post hittades inte", userNotFound: "Användaren hittades inte",
  },
}

export default function AdminNotificationsPage() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const [searchType, setSearchType] = useState('email')
  const [searchValue, setSearchValue] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [message, setMessage] = useState('')
  const [notifType, setNotifType] = useState('info')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [history, setHistory] = useState([])
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    const unsub = subscribeNotifications(setHistory)
    return () => unsub()
  }, [])

  const handleSearch = async () => {
    if (!searchValue.trim()) return
    const users = await getAllUsers()
    const userList = Object.values(users)
    let user = null
    if (searchType === 'email') {
      user = userList.find(u => u.email?.toLowerCase() === searchValue.toLowerCase())
    } else {
      user = userList.find(u => u.nickname?.toLowerCase() === searchValue.toLowerCase())
    }
    if (user) {
      setFoundUser(user)
      setSearchError('')
    } else {
      setFoundUser(null)
      setSearchError(searchType === 'email' ? lang.emailNotFound : lang.userNotFound)
    }
  }

  const handleSend = async () => {
    if (!foundUser || !message.trim()) return
    setSending(true)
    await addNotification({
      email: foundUser.email,
      type: notifType,
      title: lang.typeOptions[notifType] || notifType,
      message: message.trim(),
    })
    setSending(false)
    setSent(true)
    setMessage('')
    setFoundUser(null)
    setSearchValue('')
    setTimeout(() => setSent(false), 3000)
  }

  const typeColors = {
    confirmed: 'text-green-400 bg-green-500/10',
    cancelled: 'text-red-400 bg-red-500/10',
    info: 'text-blue-400 bg-blue-500/10',
    promo: 'text-purple-400 bg-purple-500/10',
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="text-[#ccff00]" size={28} />
          <h1 className="text-2xl font-black text-white">{lang.pageTitle}</h1>
        </div>
        <p className="text-gray-400 mb-8">{lang.subtitle}</p>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="text-white font-bold">Bildirishnoma yuborish</h3>

          {/* Search type toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            <button
              onClick={() => { setSearchType('email'); setFoundUser(null); setSearchValue(''); setSearchError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'email' ? 'bg-[#ccff00] text-black' : 'text-gray-400'
              }`}
            >
              Email orqali
            </button>
            <button
              onClick={() => { setSearchType('nickname'); setFoundUser(null); setSearchValue(''); setSearchError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'nickname' ? 'bg-[#ccff00] text-black' : 'text-gray-400'
              }`}
            >
              Nikname orqali
            </button>
          </div>

          {/* Search input */}
          <div className="flex gap-2">
            <input
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setSearchError('') }}
              placeholder={searchType === 'email' ? 'user@email.com' : 'ali_shop'}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all"
            >
              Qidirish
            </button>
          </div>

          {searchError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
              {searchError}
            </div>
          )}

          {/* Found user info */}
          {foundUser && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-white font-medium">👤 {foundUser.nickname}</p>
              <p className="text-gray-400 text-sm">{foundUser.email}</p>
              <p className="text-yellow-400 text-sm mt-1">🪙 {foundUser.coins || 0} coin</p>
            </div>
          )}

          {/* Message input (only show if user found) */}
          {foundUser && (
            <>
              <div>
                <label className="text-sm text-gray-400">{lang.typeLabel}</label>
                <select value={notifType} onChange={e => setNotifType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50 appearance-none mt-1">
                  {Object.entries(lang.typeOptions).map(([key, val]) => (
                    <option key={key} value={key} className="bg-[#0a0a0a]">{val}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400">{lang.msgLabel}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang.msgPlaceholder}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-[#ccff00]/50 resize-none"
                />
              </div>

              <button onClick={handleSend} disabled={sending || !message.trim()}
                className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {sending ? (
                  <><Clock size={20} className="animate-spin" /> {lang.sending}</>
                ) : (
                  <><Send size={20} /> {lang.send}</>
                )}
              </button>
              {sent && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 mt-4 bg-green-500/10 rounded-xl px-4 py-3">
                  <CheckCircle size={18} /> {lang.success}
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* History */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{lang.sentHistory}</h2>
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Mail size={40} className="mx-auto mb-3 opacity-30" />
              <p>{lang.noHistory}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="text-left py-3 px-2">{lang.date}</th>
                    <th className="text-left py-3 px-2">{lang.email}</th>
                    <th className="text-left py-3 px-2">{lang.type}</th>
                    <th className="text-left py-3 px-2">{lang.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(entry => (
                    <tr key={entry.id} className="border-b border-white/5 text-white hover:bg-white/[0.02]">
                      <td className="py-3 px-2 text-gray-400 whitespace-nowrap">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2">{entry.email}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[entry.type] || 'text-gray-400 bg-gray-500/10'}`}>
                          {lang.typeOptions[entry.type] || entry.type}
                        </span>
                      </td>
                      <td className="py-3 px-2"><span className="text-green-400 text-xs">{lang.sent}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
