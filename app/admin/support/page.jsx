'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, MessageCircle, ArrowLeft, Eye } from 'lucide-react'
import { getSupportMessages, addAdminReply, closeTicket, getPendingCount, getSupportMessageById, markAsAdminViewed } from '@/data/supportMessages'
import { useI18n } from '@/i18n'

const L = {
  uz: {
    pageTitle: "Qo'llab-quvvatlash", searchPlaceholder: 'Qidirish...',
    filters: ['Kutilayotgan', 'Javob berilgan', 'Barchasi'],
    statusPending: 'Kutilmoqda', statusReplied: 'Javob berildi', statusClosed: 'Yopilgan',
    noMessages: "Xabarlar yo'q", selectMessage: 'Xabarni tanlang',
    customer: 'Mijoz', subject: 'Mavzu', orderId: 'Buyurtma ID',
    replyPlaceholder: 'Javobni yozing...', send: 'Yuborish',
    closeTicket: 'Ticketni yopish', back: 'Orqaga',
    admin: 'Admin',
  },
  ru: {
    pageTitle: 'Поддержка', searchPlaceholder: 'Поиск...',
    filters: ['Ожидающие', 'Отвеченные', 'Все'],
    statusPending: 'Ожидает', statusReplied: 'Отвечено', statusClosed: 'Закрыто',
    noMessages: 'Нет сообщений', selectMessage: 'Выберите сообщение',
    customer: 'Клиент', subject: 'Тема', orderId: 'ID заказа',
    replyPlaceholder: 'Напишите ответ...', send: 'Отправить',
    closeTicket: 'Закрыть тикет', back: 'Назад',
    admin: 'Админ',
  },
  en: {
    pageTitle: 'Support', searchPlaceholder: 'Search...',
    filters: ['Pending', 'Replied', 'All'],
    statusPending: 'Pending', statusReplied: 'Replied', statusClosed: 'Closed',
    noMessages: 'No messages', selectMessage: 'Select a message',
    customer: 'Customer', subject: 'Subject', orderId: 'Order ID',
    replyPlaceholder: 'Write a reply...', send: 'Send',
    closeTicket: 'Close ticket', back: 'Back',
    admin: 'Admin',
  },
  fi: {
    pageTitle: 'Tuki', searchPlaceholder: 'Hae...',
    filters: ['Odottaa', 'Vastattu', 'Kaikki'],
    statusPending: 'Odottaa', statusReplied: 'Vastattu', statusClosed: 'Suljettu',
    noMessages: 'Ei viestejä', selectMessage: 'Valitse viesti',
    customer: 'Asiakas', subject: 'Aihe', orderId: 'Tilaus ID',
    replyPlaceholder: 'Kirjoita vastaus...', send: 'Lähetä',
    closeTicket: 'Sulje tiketti', back: 'Takaisin',
    admin: 'Ylläpitäjä',
  },
  sv: {
    pageTitle: 'Support', searchPlaceholder: 'Sök...',
    filters: ['Väntar', 'Besvarad', 'Alla'],
    statusPending: 'Väntar', statusReplied: 'Besvarad', statusClosed: 'Stängd',
    noMessages: 'Inga meddelanden', selectMessage: 'Välj ett meddelande',
    customer: 'Kund', subject: 'Ämne', orderId: 'Beställnings-ID',
    replyPlaceholder: 'Skriv ett svar...', send: 'Skicka',
    closeTicket: 'Stäng ärende', back: 'Tillbaka',
    admin: 'Admin',
  },
}

export default function AdminSupportPage() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')

  const loadMessages = () => setMessages(getSupportMessages())

  useEffect(() => {
    loadMessages()
    const h = () => loadMessages()
    window.addEventListener('support-message-updated', h)
    return () => window.removeEventListener('support-message-updated', h)
  }, [])

  const filterKeys = ['pending', 'replied', 'all']

  const filtered = messages.filter(m => {
    if (filter === 'pending' && m.status !== 'pending') return false
    if (filter === 'replied' && m.status !== 'replied') return false
    if (search && !m.name?.toLowerCase().includes(search.toLowerCase()) && !m.email?.toLowerCase().includes(search.toLowerCase()) && !m.message?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const countByStatus = (status) => messages.filter(m => m.status === status).length

  const selectMessage = (msg) => {
    markAsAdminViewed(msg.id)
    setSelected(msg)
    loadMessages()
  }

  const handleSendReply = () => {
    const input = document.getElementById('admin-reply-input')
    if (!input?.value?.trim() || !selected) return
    addAdminReply(selected.id, input.value.trim())
    input.value = ''
    loadMessages()
    setSelected(prev => ({ ...getSupportMessages().find(m => m.id === prev.id) }))
  }

  const handleCloseTicket = () => {
    if (!selected) return
    closeTicket(selected.id)
    loadMessages()
    setSelected(prev => ({ ...getSupportMessages().find(m => m.id === prev.id) }))
  }

  const handleStatusChange = (newStatus) => {
    if (!selected) return
    if (newStatus === 'closed') {
      closeTicket(selected.id)
    } else {
      const msg = getSupportMessageById(selected.id)
      if (msg) {
        msg.status = newStatus
        const all = getSupportMessages()
        const idx = all.findIndex(m => m.id === selected.id)
        if (idx >= 0) {
          all[idx] = msg
          localStorage.setItem('tenza_support_messages', JSON.stringify(all))
          window.dispatchEvent(new CustomEvent('support-message-updated'))
        }
      }
    }
    loadMessages()
    setSelected(prev => ({ ...getSupportMessages().find(m => m.id === prev.id) }))
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const shortDate = (d) => {
    const date = new Date(d)
    const diff = Date.now() - date
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString()
  }

  const statusBadge = (status) => {
    if (status === 'pending') return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">{lang.statusPending}</span>
    if (status === 'replied') return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">{lang.statusReplied}</span>
    return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">{lang.statusClosed}</span>
  }

  const [mobileList, setMobileList] = useState(true)

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col lg:flex-row bg-[#050505]">
      {/* Left sidebar */}
      <div className={`${selected && !mobileList ? 'hidden' : 'flex'} lg:flex w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex-col bg-[#0a0a0a]`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white mb-3">{lang.pageTitle}</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={lang.searchPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm outline-none focus:border-[#ccff00]/50" />
          </div>
        </div>
        <div className="flex border-b border-white/10 overflow-x-auto">
          {lang.filters.map((f, i) => {
            const key = filterKeys[i]
            const count = key === 'all' ? messages.length : countByStatus(key)
            return (
              <button key={i} onClick={() => setFilter(key)}
                className={`flex-1 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${filter === key ? 'text-[#ccff00]' : 'text-gray-500 hover:text-gray-300'}`}>
                {f}
                {count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter === key ? 'bg-[#ccff00]/20 text-[#ccff00]' : 'bg-white/10 text-gray-400'}`}>
                    {count}
                  </span>
                )}
                {filter === key && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ccff00]" />}
              </button>
            )
          })}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(msg => (
            <button key={msg.id} onClick={() => { selectMessage(msg); setMobileList(false) }}
              className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${selected?.id === msg.id ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-sm truncate">{msg.name}</span>
                <span className="text-gray-500 text-xs ml-2">{shortDate(msg.createdAt)}</span>
              </div>
              <p className="text-gray-500 text-xs truncate mb-1">{msg.email}</p>
              <p className="text-gray-500 text-xs truncate mb-2">{msg.subject || msg.message?.slice(0, 40)}</p>
              {statusBadge(msg.status)}
            </button>
          ))}
          {filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">{lang.noMessages}</div>}
        </div>
      </div>

      {/* Right chat view */}
      <div className={`${!selected || !mobileList ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-[#050505]`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p>{lang.selectMessage}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setMobileList(true)} className="lg:hidden text-gray-400 hover:text-white p-1 -ml-1">
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-white font-bold text-lg">{selected.name}</h3>
                <div className="ml-auto flex items-center gap-2">
                  <select value={selected.status} onChange={e => handleStatusChange(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm outline-none focus:border-[#ccff00]/50">
                    <option value="pending" className="bg-[#111]">{lang.statusPending}</option>
                    <option value="replied" className="bg-[#111]">{lang.statusReplied}</option>
                    <option value="closed" className="bg-[#111]">{lang.statusClosed}</option>
                  </select>
                  <button onClick={handleCloseTicket}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors">
                    {lang.closeTicket}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-xs flex-wrap">
                <span>{selected.email}</span>
                {selected.subject && <><span className="text-gray-600">|</span><span>{selected.subject}</span></>}
                {selected.orderId && <><span className="text-gray-600">|</span><span>{lang.orderId}: {selected.orderId}</span></>}
                <span className="text-gray-600">|</span>
                <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-3 border border-white/5">
                  <p className="text-gray-400 text-xs mb-1">{selected.name}</p>
                  <p className="text-white text-sm leading-relaxed">{selected.message}</p>
                  <p className="text-gray-600 text-xs mt-1.5">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              {(selected.replies || []).map((r, i) => (
                <div key={r.id || i} className={`flex ${r.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 border ${r.from === 'admin' ? 'bg-[#ccff00]/15 border-[#ccff00]/20 rounded-tr-sm' : 'bg-white/[0.05] border-white/5 rounded-tl-sm'}`}>
                    <p className={`text-xs mb-1 font-medium ${r.from === 'admin' ? 'text-[#ccff00]' : 'text-gray-400'}`}>
                      {r.from === 'admin' ? lang.admin : (r.userName || selected.name)}
                    </p>
                    <p className="text-white text-sm leading-relaxed">{r.text}</p>
                    <p className="text-gray-600 text-xs mt-1.5">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
              <div className="flex gap-3">
                <input id="admin-reply-input" type="text"
                  placeholder={lang.replyPlaceholder}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendReply() }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50 placeholder-gray-600" />
                <button onClick={handleSendReply}
                  className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50">
                  <Send size={18} /> {lang.send}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
