'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, Package, ShoppingCart,
  Eye, Flame, Users, Clock, ArrowUp, ArrowDown
} from 'lucide-react'
import Link from 'next/link'
import { getOrders, getOrderStats, itemName } from '@/utils/orders'
import { getProducts } from '@/data/productStore'
import { useHeatMap } from '@/hooks/useHeatMap'
import { useI18n } from '@/i18n'

const L = {
  uz: {
    title: 'Dashboard', revenue: 'Daromad', orders: 'Buyurtmalar',
    users: 'Foydalanuvchilar', views: 'Ko\'rishlar', conversion: 'Konversiya',
    pending: 'Kutilayotgan', processing: 'Tayyorlanmoqda', shipped: 'Jo\'natilgan',
    delivered: 'Yetkazilgan', cancelled: 'Bekor qilingan', revenueTotal: 'Jami daromad',
    mostSold: 'Eng ko\'p sotilgan', recentOrders: 'Oxirgi buyurtmalar',
    noData: 'Ma\'lumot yo\'q', allOrders: 'Barcha buyurtmalar',
    products: 'Mahsulotlar', stats: 'Statistika', today: 'Bugun',
    vsYesterday: 'Kechagidan', newUsers: 'Yangi foydalanuvchilar',
    activeOrders: 'Faol buyurtmalar',
  },
  ru: {
    title: 'Дашборд', revenue: 'Доход', orders: 'Заказы',
    users: 'Пользователи', views: 'Просмотры', conversion: 'Конверсия',
    pending: 'Ожидает', processing: 'Готовится', shipped: 'Отправлен',
    delivered: 'Доставлен', cancelled: 'Отменён', revenueTotal: 'Общий доход',
    mostSold: 'Самые продаваемые', recentOrders: 'Последние заказы',
    noData: 'Нет данных', allOrders: 'Все заказы',
    products: 'Товары', stats: 'Статистика', today: 'Сегодня',
    vsYesterday: 'От вчера', newUsers: 'Новые пользователи',
    activeOrders: 'Активные заказы',
  },
  en: {
    title: 'Dashboard', revenue: 'Revenue', orders: 'Orders',
    users: 'Users', views: 'Views', conversion: 'Conversion',
    pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
    delivered: 'Delivered', cancelled: 'Cancelled', revenueTotal: 'Total Revenue',
    mostSold: 'Most Sold', recentOrders: 'Recent Orders',
    noData: 'No data', allOrders: 'All Orders',
    products: 'Products', stats: 'Statistics', today: 'Today',
    vsYesterday: 'Vs yesterday', newUsers: 'New Users',
    activeOrders: 'Active Orders',
  },
  fi: {
    title: 'Hallintapaneeli', revenue: 'Tulot', orders: 'Tilaukset',
    users: 'Käyttäjät', views: 'Katselut', conversion: 'Konversio',
    pending: 'Odottaa', processing: 'Käsitellään', shipped: 'Lähetetty',
    delivered: 'Toimitettu', cancelled: 'Peruttu', revenueTotal: 'Kokonaistulot',
    mostSold: 'Myydyimmät', recentOrders: 'Viimeisimmät tilaukset',
    noData: 'Ei tietoja', allOrders: 'Kaikki tilaukset',
    products: 'Tuotteet', stats: 'Tilastot', today: 'Tänään',
    vsYesterday: 'Eiliseen', newUsers: 'Uudet käyttäjät',
    activeOrders: 'Aktiiviset tilaukset',
  },
  sv: {
    title: 'Dashboard', revenue: 'Intäkter', orders: 'Beställningar',
    users: 'Användare', views: 'Visningar', conversion: 'Konvertering',
    pending: 'Väntar', processing: 'Bearbetas', shipped: 'Skickad',
    delivered: 'Levererad', cancelled: 'Avbruten', revenueTotal: 'Totala intäkter',
    mostSold: 'Mest sålda', recentOrders: 'Senaste beställningar',
    noData: 'Ingen data', allOrders: 'Alla beställningar',
    products: 'Produkter', stats: 'Statistik', today: 'Idag',
    vsYesterday: 'Från igår', newUsers: 'Nya användare',
    activeOrders: 'Aktiva beställningar',
  },
}

export default function AdminDashboard() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const { stats, getHotProducts } = useHeatMap()
  const [orders, setOrders] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [allOrders, setAllOrders] = useState([])

  useEffect(() => {
    setOrders(getOrders())
    setAllOrders(getOrders())
    try {
      const users = JSON.parse(localStorage.getItem('tenza_users') || '[]')
      if (Array.isArray(users)) setUserCount(users.length)
      else setUserCount(Object.keys(users).length)
    } catch { setUserCount(0) }

    const h = () => {
      setOrders(getOrders())
      setAllOrders(getOrders())
    }
    window.addEventListener('storage', h)
    window.addEventListener('coins-updated', h)
    return () => {
      window.removeEventListener('storage', h)
      window.removeEventListener('coins-updated', h)
    }
  }, [])

  const statsData = getOrderStats()
  const totalRevenue = statsData.totalRevenue
  const totalOrders = statsData.total
  const totalViews = Object.values(stats).reduce((sum, s) => sum + (s.views || 0), 0)
  const totalPurchases = Object.values(stats).reduce((sum, s) => sum + (s.purchases || 0), 0)
  const conversionRate = totalViews > 0 ? ((totalPurchases / totalViews) * 100).toFixed(1) : '0'
  const hotProducts = getHotProducts(5)
  const recentOrders = [...orders].reverse().slice(0, 5)
  const todayOrders = Array.isArray(allOrders) ? allOrders.filter(o => o?.createdAt && Date.now() - new Date(o.createdAt).getTime() < 86400000).length : 0

  const cards = [
    { icon: DollarSign, value: `$${totalRevenue.toFixed(0)}`, label: lang.revenue, color: 'text-green-400', bg: 'bg-green-500/10', change: '+12%' },
    { icon: ShoppingCart, value: totalOrders, label: lang.orders, color: 'text-blue-400', bg: 'bg-blue-500/10', change: `+${statsData.pending} ${lang.pending}` },
    { icon: Users, value: userCount, label: lang.users, color: 'text-purple-400', bg: 'bg-purple-500/10', change: `+${todayOrders} ${lang.today}` },
    { icon: Eye, value: totalViews, label: lang.views, color: 'text-orange-400', bg: 'bg-orange-500/10', change: `${conversionRate}% ${lang.conversion}` },
  ]

  const statusCards = [
    { label: lang.pending, value: statsData.pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10', href: '/admin/orders' },
    { label: lang.processing, value: statsData.processing, color: 'text-blue-400', bg: 'bg-blue-500/10', href: '/admin/orders' },
    { label: lang.shipped, value: statsData.shipped, color: 'text-purple-400', bg: 'bg-purple-500/10', href: '/admin/orders' },
    { label: lang.delivered, value: statsData.delivered, color: 'text-green-400', bg: 'bg-green-500/10', href: '/admin/orders' },
    { label: lang.cancelled, value: statsData.cancelled, color: 'text-red-400', bg: 'bg-red-500/10', href: '/admin/orders' },
  ]

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{lang.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString(locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : locale === 'fi' ? 'fi-FI' : locale === 'sv' ? 'sv-SE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link href="/admin/orders" className="px-4 py-2 bg-[#ccff00]/10 text-[#ccff00] rounded-xl text-sm font-bold hover:bg-[#ccff00]/20 transition-all">
            {lang.allOrders} &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`${card.bg} border border-white/5 rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <card.icon size={20} className={card.color} />
              {card.change && <span className="text-[#ccff00] text-xs font-bold">{card.change}</span>}
            </div>
            <p className="text-2xl font-black text-white">{card.value}</p>
            <p className="text-gray-400 text-xs mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {statusCards.map((card, i) => (
          <Link key={i} href={card.href}
            className={`${card.bg} border border-white/5 rounded-xl p-4 text-center hover:scale-[1.02] transition-transform`}>
            <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
            <p className="text-gray-400 text-xs mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" /> {lang.mostSold}
          </h3>
          <div className="space-y-3">
            {hotProducts.map((id, i) => {
              const product = getProducts().find(p => p.id === id)
              if (!product) return null
              const s = stats[id] || {}
              return (
                <div key={id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-xl">
                  <span className="text-2xl font-black text-gray-600 w-8">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {typeof product.name === 'string' ? product.name : product.name?.[locale] || product.name?.en}
                    </p>
                    <p className="text-gray-500 text-xs">{s.purchases || 0} {s.purchases === 1 ? 'sotuv' : 'sotuv'}</p>
                  </div>
                  <span className="text-[#ccff00] font-bold">${product.price}</span>
                </div>
              )
            })}
            {hotProducts.length === 0 && <p className="text-gray-500 text-sm text-center py-4">{lang.noData}</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Package size={18} className="text-[#ccff00]" /> {lang.recentOrders}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentOrders.map(order => (
              <Link key={order.id || order.orderId} href="/admin/orders"
                className="block p-3 bg-white/[0.01] rounded-xl border border-white/5 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-mono font-bold">#{order.id || order.orderId}</p>
                  <span className="text-[#ccff00] text-sm font-bold">${(order.total || order.totalPrice || 0).toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <span>{order.customerName || order.fullName || '?'}</span>
                  <span>{order.city || '?'}</span>
                  <span>{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && <p className="text-gray-500 text-sm text-center py-4">{lang.noData}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
