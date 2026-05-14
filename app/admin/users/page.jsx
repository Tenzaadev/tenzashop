'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, Mail, Phone, Calendar, ShoppingBag,
  DollarSign, X, Star, Shield, User as UserIcon,
  MapPin, Clock, Coins, Activity
} from 'lucide-react'
import { useI18n } from '@/i18n'
import { getOrders } from '@/utils/orders'

const L = {
  uz: {
    title: 'Foydalanuvchilar', search: 'Qidirish...', total: 'Jami foydalanuvchilar',
    active: 'Faol', withOrders: 'Buyurtmali', coins: 'Coin\'lar',
    email: 'Email', phone: 'Telefon', registered: 'Ro\'yxatdan o\'tgan',
    orders: 'Buyurtmalar', spent: 'Sarflangan', noUsers: 'Foydalanuvchilar yo\'q',
    details: 'Tafsilotlar', close: 'Yopish', userDetail: 'Foydalanuvchi tafsilotlari',
    recentOrders: 'Oxirgi buyurtmalar', noOrders: 'Buyurtmalar yo\'q',
    status: 'Holat', coinsBalance: 'Coin balansi', totalSpent: 'Jami sarflangan',
    lastActive: 'Oxirgi faollik', memberSince: 'A\'zo bo\'lgan',
    nickname: 'Nikname', login: 'Login',
  },
  ru: {
    title: 'Пользователи', search: 'Поиск...', total: 'Всего пользователей',
    active: 'Активные', withOrders: 'С заказами', coins: 'Монеты',
    email: 'Email', phone: 'Телефон', registered: 'Зарегистрирован',
    orders: 'Заказы', spent: 'Потрачено', noUsers: 'Нет пользователей',
    details: 'Детали', close: 'Закрыть', userDetail: 'Детали пользователя',
    recentOrders: 'Последние заказы', noOrders: 'Нет заказов',
    status: 'Статус', coinsBalance: 'Баланс монет', totalSpent: 'Всего потрачено',
    lastActive: 'Последняя активность', memberSince: 'Участник с',
    nickname: 'Никнейм', login: 'Логин',
  },
  en: {
    title: 'Users', search: 'Search...', total: 'Total Users',
    active: 'Active', withOrders: 'With Orders', coins: 'Coins',
    email: 'Email', phone: 'Phone', registered: 'Registered',
    orders: 'Orders', spent: 'Spent', noUsers: 'No users',
    details: 'Details', close: 'Close', userDetail: 'User Details',
    recentOrders: 'Recent Orders', noOrders: 'No orders',
    status: 'Status', coinsBalance: 'Coin Balance', totalSpent: 'Total Spent',
    lastActive: 'Last Active', memberSince: 'Member Since',
    nickname: 'Nickname', login: 'Login',
  },
  fi: {
    title: 'Käyttäjät', search: 'Hae...', total: 'Käyttäjät yhteensä',
    active: 'Aktiiviset', withOrders: 'Tilauksilla', coins: 'Kolikot',
    email: 'Sähköposti', phone: 'Puhelin', registered: 'Rekisteröitynyt',
    orders: 'Tilaukset', spent: 'Käytetty', noUsers: 'Ei käyttäjiä',
    details: 'Tiedot', close: 'Sulje', userDetail: 'Käyttäjän tiedot',
    recentOrders: 'Viimeisimmät tilaukset', noOrders: 'Ei tilauksia',
    status: 'Tila', coinsBalance: 'Kolikkosaldo', totalSpent: 'Käytetty yhteensä',
    lastActive: 'Viimeksi aktiivinen', memberSince: 'Jäsen alkaen',
    nickname: 'Nimimerkki', login: 'Kirjautuminen',
  },
  sv: {
    title: 'Användare', search: 'Sök...', total: 'Totalt användare',
    active: 'Aktiva', withOrders: 'Med beställningar', coins: 'Mynt',
    email: 'E-post', phone: 'Telefon', registered: 'Registrerad',
    orders: 'Beställningar', spent: 'Spenderat', noUsers: 'Inga användare',
    details: 'Detaljer', close: 'Stäng', userDetail: 'Användardetaljer',
    recentOrders: 'Senaste beställningar', noOrders: 'Inga beställningar',
    status: 'Status', coinsBalance: 'Myntsaldo', totalSpent: 'Totalt spenderat',
    lastActive: 'Senast aktiv', memberSince: 'Medlem sedan',
    nickname: 'Smeknamn', login: 'Inloggning',
  },
}

function getAllUsers() {
  try {
    const raw = localStorage.getItem('tenza_users')
    if (!raw) return []
    const data = JSON.parse(raw)
    if (Array.isArray(data)) return data
    return Object.values(data)
  } catch { return [] }
}

function getQuickRegUsers() {
  try {
    const raw = localStorage.getItem('tenza_user')
    if (!raw) return []
    const u = JSON.parse(raw)
    return u ? [u] : []
  } catch { return [] }
}

function getUserEmailLogins() {
  try {
    const raw = localStorage.getItem('tenza_user_email')
    return raw ? [raw] : []
  } catch { return [] }
}

export default function AdminUsersPage() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])

  const loadUsers = () => {
    const allUsers = getAllUsers()
    const existingEmails = new Set(allUsers.map(u => u.email?.toLowerCase()))
    const qUsers = getQuickRegUsers()
    qUsers.forEach(u => {
      if (!existingEmails.has(u.email?.toLowerCase())) {
        allUsers.push(u)
        existingEmails.add(u.email?.toLowerCase())
      }
    })
    setUsers(allUsers)
  }

  useEffect(() => { loadUsers() }, [])

  useEffect(() => {
    if (selectedUser) {
      const allOrders = getOrders()
      const email = selectedUser.email?.toLowerCase()
      const login = selectedUser.login?.toLowerCase()
      setUserOrders(allOrders.filter(o =>
        o.email?.toLowerCase() === email ||
        o.login?.toLowerCase() === login ||
        o.email?.toLowerCase() === login
      ))
    }
  }, [selectedUser])

  const filtered = users.filter(u => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (u.email || '').toLowerCase().includes(q) ||
      (u.nickname || '').toLowerCase().includes(q) ||
      (u.login || '').toLowerCase().includes(q) ||
      (u.name || u.fullName || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q)
  })

  const activeUsers = users.filter(u => u.coins > 0 || u.email)
  const usersWithOrders = (() => {
    const allOrders = getOrders()
    const emailSet = new Set(allOrders.map(o => o.email?.toLowerCase()).filter(Boolean))
    return users.filter(u => emailSet.has(u.email?.toLowerCase()))
  })()

  const totalCoins = users.reduce((s, u) => s + (u.coins || 0), 0)
  const totalSpent = (() => {
    const allOrders = getOrders()
    return allOrders.reduce((s, o) => s + (o.total || o.totalPrice || 0), 0)
  })()

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-[#ccff00]" size={28} /> {lang.title}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} {lang.total.toLowerCase()}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Users, value: users.length, label: lang.total, color: 'text-[#ccff00]', bg: 'bg-[#ccff00]/10' },
            { icon: Activity, value: activeUsers.length, label: lang.active, color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: ShoppingBag, value: usersWithOrders.length, label: lang.withOrders, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Coins, value: totalCoins, label: lang.coins, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${card.bg} border border-white/5 rounded-2xl p-4`}>
              <card.icon size={20} className={`${card.color} mb-2`} />
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-gray-400 text-xs">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang.search}
            className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#ccff00]/50 placeholder-gray-600" />
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-4 font-medium">{lang.email}</th>
                  <th className="text-left py-4 px-4 font-medium">{lang.nickname}</th>
                  <th className="text-left py-4 px-4 font-medium">{lang.coins}</th>
                  <th className="text-left py-4 px-4 font-medium">{lang.orders}</th>
                  <th className="text-left py-4 px-4 font-medium">{lang.spent}</th>
                  <th className="text-left py-4 px-4 font-medium">{lang.registered}</th>
                  <th className="text-left py-4 px-4 font-medium w-20">{lang.details}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => {
                  const email = user.email || user.login || '?'
                  const orderCount = getOrders().filter(o =>
                    o.email?.toLowerCase() === email.toLowerCase() ||
                    o.login?.toLowerCase() === email.toLowerCase()
                  ).length
                  const userTotal = getOrders().filter(o =>
                    o.email?.toLowerCase() === email.toLowerCase() ||
                    o.login?.toLowerCase() === email.toLowerCase()
                  ).reduce((s, o) => s + (o.total || o.totalPrice || 0), 0)

                  return (
                    <tr key={email + (user.nickname || '')} className="border-b border-white/5 text-white text-sm hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-500" />
                          <span className="text-gray-300">{email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-gray-500" />
                          <span>{user.nickname || user.login || user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-yellow-400 font-bold">{user.coins || 0}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">{orderCount}</td>
                      <td className="py-4 px-4">
                        <span className="text-[#ccff00] font-bold">${userTotal.toFixed(0)}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-xs">
                        {user.registeredAt || user.createdAt ? new Date(user.registeredAt || user.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <button onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 bg-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/20 transition-colors">
                          {lang.details}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Users size={48} className="mx-auto mb-3 opacity-30" />
              <p>{lang.noUsers}</p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 lg:pt-16 overflow-y-auto"
            onClick={() => setSelectedUser(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{lang.userDetail}</h2>
                  <p className="text-gray-500 text-xs mt-1">{selectedUser.email || selectedUser.login}</p>
                </div>
                <button onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 uppercase tracking-wider">
                      <UserIcon size={14} className="inline mr-1" /> {lang.details}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang.email}</span>
                        <span className="text-white">{selectedUser.email || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang.login}</span>
                        <span className="text-white">{selectedUser.login || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang.nickname}</span>
                        <span className="text-white">{selectedUser.nickname || selectedUser.name || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang.phone}</span>
                        <span className="text-white">{selectedUser.phone || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 uppercase tracking-wider">
                      <Coins size={14} className="inline mr-1" /> {lang.coinsBalance}
                    </h4>
                    <p className="text-4xl font-black text-yellow-400">{selectedUser.coins || 0}</p>
                    <p className="text-gray-400 text-xs mt-1">{lang.coins}</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                  <h4 className="text-[#ccff00] font-bold text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag size={14} /> {lang.recentOrders} ({userOrders.length})
                  </h4>
                  <div className="space-y-2">
                    {userOrders.slice().reverse().slice(0, 5).map((o, i) => (
                      <div key={o.id || o.orderId || i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-white text-sm font-mono font-bold">#{o.id || o.orderId}</p>
                          <p className="text-gray-500 text-xs">{new Date(o.createdAt || o.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#ccff00] font-bold">${(o.total || o.totalPrice || 0).toFixed(0)}</p>
                          <p className="text-gray-500 text-xs">{o.status}</p>
                        </div>
                      </div>
                    ))}
                    {userOrders.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">{lang.noOrders}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 uppercase tracking-wider">
                      <DollarSign size={14} className="inline mr-1" /> {lang.totalSpent}
                    </h4>
                    <p className="text-3xl font-black text-[#ccff00]">
                      ${userOrders.reduce((s, o) => s + (o.total || o.totalPrice || 0), 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 uppercase tracking-wider">
                      <Calendar size={14} className="inline mr-1" /> {lang.memberSince}
                    </h4>
                    <p className="text-white text-lg font-bold">
                      {selectedUser.registeredAt || selectedUser.createdAt
                        ? new Date(selectedUser.registeredAt || selectedUser.createdAt).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
