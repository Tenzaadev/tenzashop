'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Package, MessageCircle,
  Users, Bell, Gift, Settings, LogOut, Menu, X
} from 'lucide-react'
import { getPendingCount } from '@/data/supportMessages'

const navItems = [
  { href: '/admin', label: { uz: 'Dashboard', ru: 'Дашборд', en: 'Dashboard', fi: 'Hallintapaneeli', sv: 'Dashboard' }, icon: LayoutDashboard },
  { href: '/admin/products', label: { uz: 'Mahsulotlar', ru: 'Товары', en: 'Products', fi: 'Tuotteet', sv: 'Produkter' }, icon: Package },
  { href: '/admin/orders', label: { uz: 'Buyurtmalar', ru: 'Заказы', en: 'Orders', fi: 'Tilaukset', sv: 'Beställningar' }, icon: ShoppingBag, badgeKey: 'orders' },
  { href: '/admin/support', label: { uz: "Qo'llab-quvvatlash", ru: 'Поддержка', en: 'Support', fi: 'Tuki', sv: 'Support' }, icon: MessageCircle, badgeKey: 'support' },
  { href: '/admin/users', label: { uz: 'Foydalanuvchilar', ru: 'Пользователи', en: 'Users', fi: 'Käyttäjät', sv: 'Användare' }, icon: Users },
  { href: '/admin/notifications', label: { uz: 'Bildirishnomalar', ru: 'Уведомления', en: 'Notifications', fi: 'Ilmoitukset', sv: 'Notifieringar' }, icon: Bell, badgeKey: 'notifications' },
  { href: '/admin/referrals', label: { uz: 'Referal', ru: 'Рефералы', en: 'Referrals', fi: 'Kutsut', sv: 'Referenser' }, icon: Gift },
  { href: '/admin/settings', label: { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings', fi: 'Asetukset', sv: 'Inställningar' }, icon: Settings },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [badges, setBadges] = useState({ orders: 0, support: 0, notifications: 0 })

  const refreshBadges = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('tenza_orders') || '[]')
      const pendingOrders = orders.filter(o => o.status === 'pending_verification').length
      const pendingSupport = getPendingCount()
      const notifs = JSON.parse(localStorage.getItem('tenza_notifications') || '{}')
      let unread = 0
      Object.values(notifs).forEach(arr => {
        arr.forEach(n => { if (!n.read) unread++ })
      })
      setBadges({ orders: pendingOrders, support: pendingSupport, notifications: unread })
    } catch {}
  }

  useEffect(() => {
    if (localStorage.getItem('tenza_admin_auth') === 'true') setAuthed(true)
    refreshBadges()
    const h = () => refreshBadges()
    window.addEventListener('support-message-updated', h)
    window.addEventListener('notification-added', h)
    window.addEventListener('coins-updated', h)
    window.addEventListener('storage', h)
    return () => {
      window.removeEventListener('support-message-updated', h)
      window.removeEventListener('notification-added', h)
      window.removeEventListener('coins-updated', h)
      window.removeEventListener('storage', h)
    }
  }, [])

  const handleLogin = () => {
    if (password === 'tenza2026') { setAuthed(true); localStorage.setItem('tenza_admin_auth', 'true') }
  }

  const handleLogout = () => {
    localStorage.removeItem('tenza_admin_auth')
    setAuthed(false)
    router.push('/admin')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-white">TENZA <span className="text-[#ccff00]">Admin</span></h1>
            <p className="text-gray-400 text-sm mt-2">Admin panelga kirish</p>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Parol" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50 mb-4" />
          <button onClick={handleLogin} className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all">
            Kirish
          </button>
        </div>
      </div>
    )
  }

  const isActive = (href) => {
    if (href === '/admin' && pathname === '/admin') return true
    if (href !== '/admin' && pathname?.startsWith(href)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden text-gray-400 hover:text-white transition-colors">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-200 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">T</span>
            </div>
            <span className="text-xl font-black text-white">TENZA <span className="text-[#ccff00]">Admin</span></span>
          </Link>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 80px - 60px)' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive(item.href) ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label.uz}</span>
              </div>
              {item.badgeKey && badges[item.badgeKey] > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {badges[item.badgeKey]}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0a0a0a]">
          <button onClick={handleLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full px-4 py-3 rounded-xl hover:bg-white/5">
            <LogOut size={20} />
            <span className="text-sm font-medium">Chiqish</span>
          </button>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  )
}
