'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Send, MessageSquare, CheckCircle, RefreshCw } from 'lucide-react'
import { saveSupportMessage, getMessagesByEmail, addCustomerReply } from '@/data/supportMessages'
import { useI18n } from '@/i18n'

const translations = {
  uz: {
    title: "Qo'llab-quvvatlash",
    subtitle: 'Savolingiz bormi? Biz bilan bog\'laning!',
    formTitle: 'Xabar yuborish',
    name: 'Ismingiz',
    namePlaceholder: 'Ismingizni kiriting',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    subject: 'Mavzu',
    orderId: "Buyurtma ID (ixtiyoriy)",
    orderIdPlaceholder: 'Masalan: #ABC123',
    message: 'Xabar',
    messagePlaceholder: 'Xabaringizni yozing...',
    send: 'Yuborish',
    sending: 'Yuborilmoqda...',
    sent: "✅ Xabaringiz yuborildi!",
    sentDesc: "24 soat ichida javob beramiz. Javobni bildirishnomalarda ko'rishingiz mumkin.",
    sendAnother: 'Yana xabar yuborish',
    telegramTitle: 'Telegram orqali',
    telegramDesc: "Tezroq javob olish uchun Telegram'da yozing",
    telegramBtn: '@tenza_me ga yozish',
    subjects: {
      order: 'Buyurtma haqida',
      payment: "To'lov muammosi",
      product: 'Mahsulot savoli',
      return: 'Qaytarish',
      other: 'Boshqa'
    },
    chatTitle: 'Suhbat',
    noChat: 'Hali xabar yubormagansiz',
    yourMessages: 'Sizning xabarlaringiz',
    adminReplied: 'Admin javob berdi',
    youReplied: 'Siz javob berdingiz',
    reply: 'Javob yozish',
    replyPlaceholder: 'Javobingizni yozing...',
    replySend: 'Yuborish',
    closed: 'Yopilgan',
    statusPending: 'Kutilmoqda',
    statusReplied: 'Javob berildi',
    statusClosed: 'Yopilgan',
  },
  ru: {
    title: 'Поддержка',
    subtitle: 'Есть вопрос? Свяжитесь с нами!',
    formTitle: 'Отправить сообщение',
    name: 'Ваше имя',
    namePlaceholder: 'Введите имя',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    subject: 'Тема',
    orderId: 'Номер заказа (необязательно)',
    orderIdPlaceholder: 'Например: #ABC123',
    message: 'Сообщение',
    messagePlaceholder: 'Напишите ваше сообщение...',
    send: 'Отправить',
    sending: 'Отправка...',
    sent: '✅ Сообщение отправлено!',
    sentDesc: 'Ответим в течение 24 часов. Ответ появится в уведомлениях.',
    sendAnother: 'Отправить ещё',
    telegramTitle: 'Через Telegram',
    telegramDesc: 'Для быстрого ответа напишите в Telegram',
    telegramBtn: 'Написать @tenza_me',
    subjects: {
      order: 'О заказе',
      payment: 'Проблема с оплатой',
      product: 'Вопрос о товаре',
      return: 'Возврат',
      other: 'Другое'
    },
    chatTitle: 'Чат',
    noChat: 'Вы ещё не отправляли сообщений',
    yourMessages: 'Ваши сообщения',
    adminReplied: 'Админ ответил',
    youReplied: 'Вы ответили',
    reply: 'Ответить',
    replyPlaceholder: 'Напишите ответ...',
    replySend: 'Отправить',
    closed: 'Закрыто',
    statusPending: 'Ожидает',
    statusReplied: 'Отвечено',
    statusClosed: 'Закрыто',
  },
  en: {
    title: 'Support',
    subtitle: 'Have a question? Contact us!',
    formTitle: 'Send Message',
    name: 'Your Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'email@example.com',
    subject: 'Subject',
    orderId: 'Order ID (optional)',
    orderIdPlaceholder: 'E.g.: #ABC123',
    message: 'Message',
    messagePlaceholder: 'Write your message...',
    send: 'Send',
    sending: 'Sending...',
    sent: '✅ Message sent!',
    sentDesc: "We'll reply within 24 hours. Check notifications for reply.",
    sendAnother: 'Send another',
    telegramTitle: 'Via Telegram',
    telegramDesc: 'For faster response, write on Telegram',
    telegramBtn: 'Write to @tenza_me',
    subjects: {
      order: 'About order',
      payment: 'Payment issue',
      product: 'Product question',
      return: 'Return',
      other: 'Other'
    },
    chatTitle: 'Chat',
    noChat: 'No messages yet',
    yourMessages: 'Your messages',
    adminReplied: 'Admin replied',
    youReplied: 'You replied',
    reply: 'Reply',
    replyPlaceholder: 'Write your reply...',
    replySend: 'Send',
    closed: 'Closed',
    statusPending: 'Pending',
    statusReplied: 'Replied',
    statusClosed: 'Closed',
  },
  fi: {
    title: 'Tuki',
    subtitle: 'Onko kysyttävää? Ota yhteyttä!',
    formTitle: 'Lähetä viesti',
    name: 'Nimesi',
    namePlaceholder: 'Anna nimesi',
    email: 'Sähköposti',
    emailPlaceholder: 'email@example.com',
    subject: 'Aihe',
    orderId: 'Tilausnumero (valinnainen)',
    orderIdPlaceholder: 'Esim: #ABC123',
    message: 'Viesti',
    messagePlaceholder: 'Kirjoita viestisi...',
    send: 'Lähetä',
    sending: 'Lähetetään...',
    sent: '✅ Viesti lähetetty!',
    sentDesc: 'Vastaamme 24 tunnin kuluessa. Katso vastaus ilmoituksista.',
    sendAnother: 'Lähetä toinen',
    telegramTitle: 'Telegramin kautta',
    telegramDesc: 'Nopeampaa vastausta varten kirjoita Telegramissa',
    telegramBtn: 'Kirjoita @tenza_me',
    subjects: {
      order: 'Tilauksesta',
      payment: 'Maksuongelma',
      product: 'Tuotekysymys',
      return: 'Palautus',
      other: 'Muu'
    },
    chatTitle: 'Keskustelu',
    noChat: 'Ei viestejä vielä',
    yourMessages: 'Sinun viestisi',
    adminReplied: 'Ylläpitäjä vastasi',
    youReplied: 'Sinä vastasit',
    reply: 'Vastaa',
    replyPlaceholder: 'Kirjoita vastauksesi...',
    replySend: 'Lähetä',
    closed: 'Suljettu',
    statusPending: 'Odottaa',
    statusReplied: 'Vastattu',
    statusClosed: 'Suljettu',
  },
  sv: {
    title: 'Support',
    subtitle: 'Har du en fråga? Kontakta oss!',
    formTitle: 'Skicka meddelande',
    name: 'Ditt namn',
    namePlaceholder: 'Ange ditt namn',
    email: 'E-post',
    emailPlaceholder: 'email@example.com',
    subject: 'Ämne',
    orderId: 'Ordernummer (valfritt)',
    orderIdPlaceholder: 'T.ex: #ABC123',
    message: 'Meddelande',
    messagePlaceholder: 'Skriv ditt meddelande...',
    send: 'Skicka',
    sending: 'Skickar...',
    sent: '✅ Meddelande skickat!',
    sentDesc: 'Vi svarar inom 24 timmar. Se svaret i aviseringar.',
    sendAnother: 'Skicka ett till',
    telegramTitle: 'Via Telegram',
    telegramDesc: 'För snabbare svar, skriv på Telegram',
    telegramBtn: 'Skriv till @tenza_me',
    subjects: {
      order: 'Om order',
      payment: 'Betalningsproblem',
      product: 'Produktfråga',
      return: 'Retur',
      other: 'Annat'
    },
    chatTitle: 'Chatt',
    noChat: 'Inga meddelanden än',
    yourMessages: 'Dina meddelanden',
    adminReplied: 'Admin svarade',
    youReplied: 'Du svarade',
    reply: 'Svara',
    replyPlaceholder: 'Skriv ditt svar...',
    replySend: 'Skicka',
    closed: 'Stängd',
    statusPending: 'Väntar',
    statusReplied: 'Besvarad',
    statusClosed: 'Stängd',
  }
}

export default function SupportPage() {
  const { locale } = useI18n()
  const lang = translations[locale] || translations.uz

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('order')
  const [orderId, setOrderId] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const [activeTab, setActiveTab] = useState('form')
  const [userMessages, setUserMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [expandedMsg, setExpandedMsg] = useState(null)
  const [replySent, setReplySent] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tenza_user_email')
    if (saved) setEmail(saved)
  }, [])

  useEffect(() => {
    if (email) {
      const msgs = getMessagesByEmail(email)
      setUserMessages(msgs)
    }
  }, [email])

  useEffect(() => {
    if (activeTab === 'chat' && email) {
      const msgs = getMessagesByEmail(email)
      setUserMessages(msgs)
    }
  }, [activeTab])

  useEffect(() => {
    if (!email) return
    const h = () => {
      if (activeTab === 'chat') {
        const msgs = getMessagesByEmail(email)
        setUserMessages(msgs)
      }
    }
    window.addEventListener('support-message-updated', h)
    return () => window.removeEventListener('support-message-updated', h)
  }, [email, activeTab])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      const msgId = params.get('msg')
      const autoId = params.get('auto')

      if (autoId) {
        setActiveTab('form')
        setOrderId(autoId)
        setSubject('order')
        setMessage(`Buyurtma #${autoId} bo'yicha savol: `)
        const userEmail = localStorage.getItem('tenza_user_email') || ''
        if (userEmail) setEmail(userEmail)
        try {
          const tu = JSON.parse(localStorage.getItem('tenza_user') || 'null')
          if (tu?.name) setName(tu.name)
          else {
            const cu = JSON.parse(localStorage.getItem('tenza_current_user') || 'null')
            if (cu?.login) setName(cu.login)
          }
        } catch {}
        setTimeout(() => {
          const textarea = document.querySelector('textarea')
          if (textarea) {
            textarea.focus()
            const len = textarea.value.length
            textarea.setSelectionRange(len, len)
          }
        }, 300)
      } else if (tab === 'chat') {
        setActiveTab('chat')
        const chatEmail = email || localStorage.getItem('tenza_user_email') || ''
        if (chatEmail) {
          if (!email) setEmail(chatEmail)
          const msgs = getMessagesByEmail(chatEmail)
          setUserMessages(msgs)
        }
      }

      if (msgId && userMessages.length > 0) {
        const found = userMessages.find(m => m.id === msgId)
        if (found) setExpandedMsg(msgId)
      }
    }
  }, [userMessages, email])

  const loadMessages = () => {
    const e = email || localStorage.getItem('tenza_user_email') || ''
    if (e) {
      const msgs = getMessagesByEmail(e)
      setUserMessages(msgs)
      if (!email) setEmail(e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSending(true)
    saveSupportMessage({ name, email, subject, orderId, message })
    localStorage.setItem('tenza_user_email', email)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setName('')
      setMessage('')
      setOrderId('')
    }, 500)
  }

  const handleCustomerReply = (messageId) => {
    if (!replyText.trim()) return
    const user = JSON.parse(localStorage.getItem('tenza_user') || 'null')
    const messages = JSON.parse(localStorage.getItem('tenza_support_messages') || '[]')
    const msgIndex = messages.findIndex(m => m.id === messageId)
    if (msgIndex >= 0) {
      messages[msgIndex].replies.push({
        id: 'REPLY-' + Date.now().toString(36),
        from: 'customer',
        text: replyText.trim(),
        userName: user?.nickname || user?.email || 'Mijoz',
        createdAt: new Date().toISOString()
      })
      messages[msgIndex].status = 'pending'
      messages[msgIndex].updatedAt = new Date().toISOString()
      localStorage.setItem('tenza_support_messages', JSON.stringify(messages))
      window.dispatchEvent(new CustomEvent('support-message-updated'))
    }
    setReplyText('')
    setReplySent(true)
    setTimeout(() => setReplySent(false), 3000)
    loadMessages()
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    if (tab === 'chat') loadMessages()
  }

  const subjectOptions = Object.entries(lang.subjects).map(([key, label]) => ({ value: key, label }))

  const statusLabels = { pending: lang.statusPending, replied: lang.statusReplied, closed: lang.statusClosed }
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    replied: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="font-medium">{lang.title}</span>
          </Link>
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            <button onClick={() => handleTabSwitch('form')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'form' ? 'bg-[#ccff00] text-black' : 'text-gray-400 hover:text-white'}`}>
              {lang.formTitle}
            </button>
            <button onClick={() => handleTabSwitch('chat')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-[#ccff00] text-black' : 'text-gray-400 hover:text-white'}`}>
              {lang.chatTitle}
              {userMessages.length > 0 && (
                <span className="ml-1.5 w-5 h-5 bg-white/20 rounded-full text-xs inline-flex items-center justify-center">{userMessages.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto">
        {activeTab === 'form' && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-1">{lang.formTitle}</h2>
                <p className="text-gray-500 text-sm mb-6">{lang.subtitle}</p>
                {sent ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{lang.sent}</h3>
                    <p className="text-gray-400 mb-6">{lang.sentDesc}</p>
                    <button onClick={() => setSent(false)} className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 mx-auto">
                      <RefreshCw size={16} /> {lang.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">{lang.name} *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={lang.namePlaceholder} required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">{lang.email} *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={lang.emailPlaceholder} required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">{lang.subject}</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/50 transition-all">
                        {subjectOptions.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">{lang.orderId}</label>
                      <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder={lang.orderIdPlaceholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">{lang.message} *</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={lang.messagePlaceholder} required rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50 transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {sending ? <><RefreshCw size={18} className="animate-spin" /> {lang.sending}</> : <><Send size={18} /> {lang.send}</>}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 text-center h-full flex flex-col justify-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{lang.telegramTitle}</h3>
                <p className="text-gray-400 text-sm mb-6">{lang.telegramDesc}</p>
                <a href="https://t.me/tenza_me" target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <Send size={18} /> {lang.telegramBtn}
                </a>
                <p className="text-gray-600 text-xs mt-4">@tenza_me</p>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {userMessages.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">{lang.noChat}</h3>
                <p className="text-gray-600">{lang.subtitle}</p>
                <button onClick={() => setActiveTab('form')} className="mt-6 px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all inline-flex items-center gap-2">
                  <Send size={16} /> {lang.send}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#ccff00]" /> {lang.yourMessages}
                </h2>
                {userMessages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]" onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500">{msg.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[msg.status]}`}>{statusLabels[msg.status]}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{msg.message.substring(0, 60)}{msg.message.length > 60 ? '...' : ''}</p>
                      </div>
                      <span className="text-xs text-gray-600">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    {expandedMsg === msg.id && (
                      <div className="border-t border-white/5 p-4 space-y-3 max-h-96 overflow-y-auto">
                        <div className="flex gap-2 justify-end">
                          <div className="bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                            <p className="text-white text-sm">{msg.message}</p>
                            <p className="text-gray-500 text-xs mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        {msg.replies.map(reply => (
                          <div key={reply.id} className={`flex gap-2 ${reply.from === 'admin' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${reply.from === 'admin' ? 'bg-green-500/10 border border-green-500/20 rounded-tl-sm' : 'bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-tr-sm'}`}>
                              <p className="text-xs font-bold mb-0.5 text-gray-400">{reply.from === 'admin' ? 'Admin' : lang.youReplied}</p>
                              <p className="text-white text-sm">{reply.text}</p>
                              <p className="text-gray-500 text-xs mt-1">{new Date(reply.createdAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                        {msg.status !== 'closed' && (
                          <div className="border-t border-white/5 pt-3 mt-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={lang.replyPlaceholder}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#ccff00]/50"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleCustomerReply(msg.id) }}
                              />
                              <button
                                onClick={() => handleCustomerReply(msg.id)}
                                disabled={!replyText.trim()}
                                className="px-4 py-2 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-30 text-sm flex items-center gap-1"
                              >
                                <Send size={14} /> {lang.replySend}
                              </button>
                            </div>
                            {replySent && (
                              <p className="text-green-400 text-xs mt-2">{lang.replySent}</p>
                            )}
                          </div>
                        )}
                        {msg.status === 'closed' && (
                          <div className="text-center py-2">
                            <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">{lang.closed}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
