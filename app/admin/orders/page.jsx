'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Download, X, Eye, Check, AlertTriangle,
  Clock, ChevronRight, Filter, Package, MapPin, Phone,
  User, Mail, CreditCard, Truck, Calendar, DollarSign
} from 'lucide-react'
import {
  getStatusLabel, getStatusStyle,
  getStatusIcon, getNextValidStatuses,
  getNotifMessage, itemName, STATUS_LABELS
} from '@/utils/orders'
import { subscribeOrders, updateOrder, getAllOrders } from '@/lib/firestore'
import { processOrderCoins, addNotification, getUserByEmail, COIN_USD_VALUE } from '@/utils/coins'
import { useI18n } from '@/i18n'

const L = {
  uz: {
    title: 'Buyurtmalar', all: 'Hammasi', pending: 'Kutilayotgan',
    active: 'Faol', completed: 'Yakunlangan', export_: 'Export',
    search: 'Qidirish...', noOrders: 'Buyurtmalar yo\'q',
    orderDetail: 'Buyurtma tafsilotlari', customer: 'Mijoz',
    address: 'Manzil', products: 'Mahsulotlar', total: 'Jami',
    statusChange: 'Holatni o\'zgartirish', update: 'Yangilash',
    tracking: 'Jo\'natish ma\'lumotlari', trackCode: 'Track kodi',
    trackCompany: 'Kompaniya (DHL, FedEx...)', estimatedDate: 'Tahminiy yetkazish',
    coinInfo: 'Coin ma\'lumotlari', coinsUsed: 'Ishlatilgan coin',
    coinsEarned: 'Berilgan coin', remainingPayment: 'Qolgan to\'lov',
    statusHistory: 'Holat tarixi', confirm: 'Tasdiqlash', cancel: 'Bekor qilish',
    details: 'Batafsil', payment: 'To\'lov', totalRevenue: 'Jami daromad',
    activeOrders: 'Faol buyurtmalar', time: 'Vaqt', action: 'Amal',
    orderId: 'Buyurtma ID', customerName: 'Mijoz ismi', amount: 'Summa',
    status: 'Holat', date: 'Sana', filter: 'Filter',
  },
  ru: {
    title: 'Заказы', all: 'Все', pending: 'Ожидающие',
    active: 'Активные', completed: 'Завершённые', export_: 'Экспорт',
    search: 'Поиск...', noOrders: 'Нет заказов',
    orderDetail: 'Детали заказа', customer: 'Клиент',
    address: 'Адрес', products: 'Товары', total: 'Итого',
    statusChange: 'Изменить статус', update: 'Обновить',
    tracking: 'Информация об отправке', trackCode: 'Трек-код',
    trackCompany: 'Компания (DHL, FedEx...)', estimatedDate: 'Примерная доставка',
    coinInfo: 'Информация о монетах', coinsUsed: 'Использовано монет',
    coinsEarned: 'Начислено монет', remainingPayment: 'Остаток к оплате',
    statusHistory: 'История статусов', confirm: 'Подтвердить', cancel: 'Отменить',
    details: 'Детали', payment: 'Оплата', totalRevenue: 'Общий доход',
    activeOrders: 'Активные заказы', time: 'Время', action: 'Действие',
    orderId: 'ID заказа', customerName: 'Имя клиента', amount: 'Сумма',
    status: 'Статус', date: 'Дата', filter: 'Фильтр',
  },
  en: {
    title: 'Orders', all: 'All', pending: 'Pending',
    active: 'Active', completed: 'Completed', export_: 'Export',
    search: 'Search...', noOrders: 'No orders',
    orderDetail: 'Order Details', customer: 'Customer',
    address: 'Address', products: 'Products', total: 'Total',
    statusChange: 'Change Status', update: 'Update',
    tracking: 'Tracking Info', trackCode: 'Track code',
    trackCompany: 'Company (DHL, FedEx...)', estimatedDate: 'Estimated delivery',
    coinInfo: 'Coin Info', coinsUsed: 'Coins used',
    coinsEarned: 'Coins earned', remainingPayment: 'Remaining payment',
    statusHistory: 'Status History', confirm: 'Confirm', cancel: 'Cancel',
    details: 'Details', payment: 'Payment', totalRevenue: 'Total Revenue',
    activeOrders: 'Active Orders', time: 'Time', action: 'Action',
    orderId: 'Order ID', customerName: 'Customer Name', amount: 'Amount',
    status: 'Status', date: 'Date', filter: 'Filter',
  },
  fi: {
    title: 'Tilaukset', all: 'Kaikki', pending: 'Odottaa',
    active: 'Aktiiviset', completed: 'Valmiit', export_: 'Vie',
    search: 'Hae...', noOrders: 'Ei tilauksia',
    orderDetail: 'Tilaustiedot', customer: 'Asiakas',
    address: 'Osoite', products: 'Tuotteet', total: 'Yhteensä',
    statusChange: 'Vaihda tilaa', update: 'Päivitä',
    tracking: 'Seurantatiedot', trackCode: 'Seurantakoodi',
    trackCompany: 'Yritys (DHL, FedEx...)', estimatedDate: 'Arvioitu toimitus',
    coinInfo: 'Kolikkotiedot', coinsUsed: 'Käytetyt kolikot',
    coinsEarned: 'Ansaitut kolikot', remainingPayment: 'Jäljellä oleva maksu',
    statusHistory: 'Tilahistoria', confirm: 'Vahvista', cancel: 'Peruuta',
    details: 'Tiedot', payment: 'Maksu', totalRevenue: 'Kokonaistulot',
    activeOrders: 'Aktiiviset tilaukset', time: 'Aika', action: 'Toiminto',
    orderId: 'Tilaus ID', customerName: 'Asiakkaan nimi', amount: 'Summa',
    status: 'Tila', date: 'Päivä', filter: 'Suodata',
  },
  sv: {
    title: 'Beställningar', all: 'Alla', pending: 'Väntar',
    active: 'Aktiva', completed: 'Slutförda', export_: 'Exportera',
    search: 'Sök...', noOrders: 'Inga beställningar',
    orderDetail: 'Beställningsdetaljer', customer: 'Kund',
    address: 'Adress', products: 'Produkter', total: 'Totalt',
    statusChange: 'Ändra status', update: 'Uppdatera',
    tracking: 'Spårningsinfo', trackCode: 'Spårningskod',
    trackCompany: 'Företag (DHL, FedEx...)', estimatedDate: 'Beräknad leverans',
    coinInfo: 'Myntinfo', coinsUsed: 'Använda mynt',
    coinsEarned: 'Förtjänade mynt', remainingPayment: 'Återstående betalning',
    statusHistory: 'Statushistorik', confirm: 'Bekräfta', cancel: 'Avbryt',
    details: 'Detaljer', payment: 'Betalning', totalRevenue: 'Totala intäkter',
    activeOrders: 'Aktiva beställningar', time: 'Tid', action: 'Åtgärd',
    orderId: 'Beställnings-ID', customerName: 'Kundnamn', amount: 'Belopp',
    status: 'Status', date: 'Datum', filter: 'Filter',
  },
}

const statusTabLabels = {
  uz: { all: 'Hammasi', pending: 'Kutilayotgan', active: 'Faol', completed: 'Yakunlangan' },
  ru: { all: 'Все', pending: 'Ожидающие', active: 'Активные', completed: 'Завершённые' },
  en: { all: 'All', pending: 'Pending', active: 'Active', completed: 'Completed' },
  fi: { all: 'Kaikki', pending: 'Odottaa', active: 'Aktiiviset', completed: 'Valmiit' },
  sv: { all: 'Alla', pending: 'Väntar', active: 'Aktiva', completed: 'Slutförda' },
}

function Row({ label, value, mono }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between items-start py-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`text-white text-right max-w-[60%] break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}

function StatusBadge({ status, locale }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
      {getStatusIcon(status)} {getStatusLabel(status, locale)}
    </span>
  )
}

export default function AdminOrdersPage() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const tabLabels = statusTabLabels[locale] || statusTabLabels.uz
  const [activeTab, setActiveTab] = useState('pending')
  const [allOrders, setAllOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [trackCode, setTrackCode] = useState('')
  const [trackCompany, setTrackCompany] = useState('')
  const [estimatedDate, setEstimatedDate] = useState('')
  const [note, setNote] = useState('')
  const [processingAction, setProcessingAction] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/api/orders').then(r => r.json()).then(data => {
      if (mounted && data.orders) setAllOrders(data.orders)
    }).catch(() => {})
    const unsub = subscribeOrders(localOrders => {
      fetch('/api/orders').then(r => r.json()).then(data => {
        if (!mounted) return
        if (data.orders) {
          const merged = [...data.orders]
          localOrders.forEach(lo => {
            if (!merged.find(mo => (mo.id || mo.orderId) === (lo.id || lo.orderId))) {
              merged.push(lo)
            }
          })
          setAllOrders(merged)
        } else {
          setAllOrders(localOrders)
        }
      }).catch(() => setAllOrders(localOrders))
    })
    return () => { mounted = false; unsub() }
  }, [])

  useEffect(() => {
    if (activeTab === 'pending') setOrders(allOrders.filter(o => o.status === 'pending_verification'))
    else if (activeTab === 'active') setOrders(allOrders.filter(o => ['paid', 'processing', 'shipped', 'in_transit'].includes(o.status)))
    else if (activeTab === 'completed') setOrders(allOrders.filter(o => ['delivered', 'cancelled'].includes(o.status)))
    else setOrders(allOrders)
  }, [allOrders, activeTab])

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status)
      setTrackCode(selectedOrder.tracking?.code || '')
      setTrackCompany(selectedOrder.tracking?.company || '')
      setEstimatedDate(selectedOrder.tracking?.estimatedDelivery || '')
      setNote('')
    }
  }, [selectedOrder])

  const filtered = orders.filter(o => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const id = (o.id || o.orderId || '').toLowerCase()
    const name = (o.customerName || o.fullName || '').toLowerCase()
    const email = (o.email || '').toLowerCase()
    const phone = (o.phone || '').toLowerCase()
    return id.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q)
  })

  const handleConfirmPayment = async (orderId) => {
    setProcessingAction(true)
    const order = allOrders.find(o => (o.id || o.orderId) === orderId)
    if (!order) { setProcessingAction(false); return }

    const coinResult = processOrderCoins(order, 'CONFIRM')

    const historyEntry = { status: 'paid', time: new Date().toISOString(), note: 'Payment confirmed by admin' }

    const updates = {
      status: 'paid',
      paidAt: new Date().toISOString(),
      coinsDeducted: coinResult.coinsDeducted,
      coinsEarned: coinResult.coinsEarned,
      remainingPayment: coinResult.remainingPayment,
      history: [...(order.history || []), historyEntry],
    }

    await updateOrder(order.id || order.orderId, updates)
    fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id || order.orderId, ...updates }) }).catch(() => {})

    const notif = getNotifMessage('paid', order, locale)
    if (notif) {
      addNotification(order.email, {
        type: 'paid',
        title: notif.title,
        message: notif.message,
        orderId: order.id || order.orderId,
        coinsDeducted: coinResult.coinsDeducted,
        coinsEarned: coinResult.coinsEarned,
      })
    }

    setProcessingAction(false)
    setSelectedOrder(null)
  }

  const handleCancelPayment = async (orderId) => {
    setProcessingAction(true)
    const order = allOrders.find(o => (o.id || o.orderId) === orderId)
    if (!order) { setProcessingAction(false); return }

    processOrderCoins(order, 'CANCEL')

    const historyEntry = { status: 'cancelled', time: new Date().toISOString(), note: 'Payment rejected by admin' }

    const updates = {
      status: 'cancelled',
      history: [...(order.history || []), historyEntry],
    }

    await updateOrder(order.id || order.orderId, updates)
    fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id || order.orderId, ...updates }) }).catch(() => {})

    const notif = getNotifMessage('cancelled', order, locale)
    if (notif) {
      addNotification(order.email, {
        type: 'cancelled',
        title: notif.title,
        message: notif.message,
        orderId: order.id || order.orderId,
      })
    }

    setProcessingAction(false)
    setSelectedOrder(null)
  }

  const handleStatusChange = async () => {
    if (newStatus === selectedOrder.status || !newStatus) return

    const historyEntry = { status: newStatus, time: new Date().toISOString(), note: note || '' }
    const updates = {
      status: newStatus,
      history: [...(selectedOrder.history || []), historyEntry],
    }

    if (trackCode || trackCompany || estimatedDate) {
      updates.tracking = { code: trackCode, company: trackCompany, estimatedDelivery: estimatedDate }
    }

    await updateOrder(selectedOrder.id || selectedOrder.orderId, updates)
    fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedOrder.id || selectedOrder.orderId, ...updates }) }).catch(() => {})

    const notif = getNotifMessage(newStatus, selectedOrder, locale)
    if (notif) {
      addNotification(selectedOrder.email, {
        type: newStatus,
        title: notif.title,
        message: notif.message,
        orderId: selectedOrder.id || selectedOrder.orderId,
        tracking: updates.tracking,
      })
    }

    setSelectedOrder(null)
  }

  const handleExportCSV = () => {
    const all = allOrders
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'City', 'Total', 'Coins Used', 'Coins Earned', 'Status', 'Date']
    const rows = all.map(o => [
      o.id || o.orderId, o.customerName || o.fullName, o.email, o.phone,
      o.city, o.total || o.totalPrice || 0, o.coinsUsed || 0, o.coinsEarned || 0,
      o.status, new Date(o.createdAt || o.date).toISOString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `tenza_orders_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  const stats = useMemo(() => ({
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending_verification').length,
    processing: allOrders.filter(o => o.status === 'processing').length,
    shipped: allOrders.filter(o => o.status === 'shipped' || o.status === 'in_transit').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    paid: allOrders.filter(o => o.status === 'paid').length,
    revenue: allOrders.reduce((s, o) => s + (o.status === 'delivered' ? (o.total || o.totalPrice || 0) : 0), 0),
    totalRevenue: allOrders.reduce((s, o) => s + (o.total || o.totalPrice || 0), 0),
  }), [allOrders])
  const nextStatuses = selectedOrder ? getNextValidStatuses(selectedOrder.status) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Package className="text-[#ccff00]" size={28} /> {lang.title}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{stats.total} {lang.title.toLowerCase()} &middot; ${stats.totalRevenue.toFixed(0)} {lang.totalRevenue.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang.search}
                className="w-48 lg:w-64 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#ccff00]/50 placeholder-gray-600" />
            </div>
            <button onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              <Download size={16} /> {lang.export_}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: lang.all, value: stats.total, key: 'all', color: 'text-white' },
            { label: lang.pending, value: stats.pending, key: 'pending', color: 'text-yellow-400' },
            { label: lang.active, value: stats.processing + stats.shipped, key: 'active', color: 'text-blue-400' },
            { label: lang.completed, value: stats.delivered, key: 'completed', color: 'text-green-400' },
            { label: lang.cancelled, value: stats.cancelled, key: 'cancelled', color: 'text-red-400' },
            { label: `$${stats.totalRevenue.toFixed(0)}`, value: lang.revenue, key: 'revenue', color: 'text-[#ccff00]' },
          ].map(s => (
            <button key={s.key} onClick={() => setActiveTab(s.key === 'revenue' ? 'all' : s.key)}
              className={`bg-white/[0.02] border ${activeTab === s.key || (s.key === 'revenue' && activeTab === 'all') ? 'border-[#ccff00]/30 bg-[#ccff00]/5' : 'border-white/5'} rounded-xl p-3 text-center hover:bg-white/[0.04] transition-colors`}>
              <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'active', 'completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}>
              {tabLabels[tab]}
              {tab === 'pending' && stats.pending > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{stats.pending}</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Package size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">{lang.noOrders}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.slice().reverse().map(order => (
              <motion.div key={order.id || order.orderId} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="p-4 lg:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-white font-bold text-sm">#{order.id || order.orderId}</span>
                        <StatusBadge status={order.status} locale={locale} />
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-xs flex-wrap">
                        <span className="flex items-center gap-1"><User size={12} /> {order.customerName || order.fullName || '?'}</span>
                        <span className="flex items-center gap-1"><Mail size={12} /> {order.email || '?'}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {order.phone || '?'}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {order.city || '?'}</span>
                      </div>
                      {(order.coinsUsed > 0 || order.coinsEarned > 0) && (
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          {order.coinsUsed > 0 && <span className="text-yellow-400">-{order.coinsUsed} coin</span>}
                          {order.coinsEarned > 0 && <span className="text-[#ccff00]">+{order.coinsEarned} coin</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 lg:text-right">
                      <div>
                        <p className="text-[#ccff00] font-bold text-lg">${(order.total || order.totalPrice || 0).toFixed(0)}</p>
                        <p className="text-gray-500 text-xs">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {order.status === 'pending_verification' && (
                          <>
                            <button onClick={() => handleConfirmPayment(order.id || order.orderId)} disabled={processingAction}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 transition-colors flex items-center gap-1 disabled:opacity-50">
                              <Check size={12} /> {lang.confirm}
                            </button>
                            <button onClick={() => handleCancelPayment(order.id || order.orderId)} disabled={processingAction}
                              className="px-3 py-1.5 bg-red-600/50 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition-colors flex items-center gap-1 disabled:opacity-50">
                              <X size={12} /> {lang.cancel}
                            </button>
                          </>
                        )}
                        <button onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1">
                          <Eye size={12} /> {lang.details}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 lg:pt-16 overflow-y-auto"
              onClick={() => setSelectedOrder(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden"
                onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-[#111] border-b border-white/10 p-6 flex items-start justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)} {lang.orderDetail} #{selectedOrder.id || selectedOrder.orderId}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Customer + Address row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <User size={14} /> {lang.customer}
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <p className="text-white font-bold">{selectedOrder.customerName || selectedOrder.fullName || '?'}</p>
                        <p className="text-gray-400">{selectedOrder.email || '?'}</p>
                        <p className="text-gray-400">{selectedOrder.phone || '?'}</p>
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <MapPin size={14} /> {lang.address}
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <p className="text-white">{selectedOrder.city || '?'}, {selectedOrder.address || ''}</p>
                        <p className="text-gray-400">{selectedOrder.postalCode || ''} {selectedOrder.country || 'Finland'}</p>
                        {selectedOrder.houseNumber && <p className="text-gray-400">{lang.address}: {selectedOrder.houseNumber}{selectedOrder.floor ? `, ${lang.floor}: ${selectedOrder.floor}` : ''}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Package size={14} /> {lang.products} ({(selectedOrder.items || []).length})
                    </h4>
                    <div className="space-y-2">
                      {(selectedOrder.items || []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{itemName(item, locale)}</p>
                            <p className="text-gray-500 text-xs">{item.size && `/ ${item.size}`}{item.color && ` / ${item.color}`}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-white text-sm">x{item.quantity}</p>
                            <p className="text-[#ccff00] text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {(selectedOrder.items || []).length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">{lang.noOrders}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/10">
                      <span className="text-gray-400 text-sm font-medium">{lang.total}</span>
                      <span className="text-[#ccff00] text-xl font-black">${(selectedOrder.total || selectedOrder.totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coin Info */}
                  {(selectedOrder.coinsUsed > 0 || selectedOrder.coinsEarned > 0 || selectedOrder.coinsDeducted > 0) && (
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
                      <h4 className="text-yellow-400 font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <DollarSign size={14} /> {lang.coinInfo}
                      </h4>
                      <div className="space-y-2">
                        {(selectedOrder.coinsUsed > 0 || selectedOrder.coinsDeducted > 0) && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{lang.coinsUsed}:</span>
                            <span className="text-yellow-400 font-bold">-{selectedOrder.coinsDeducted || selectedOrder.coinsUsed}</span>
                          </div>
                        )}
                        {selectedOrder.coinsEarned > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{lang.coinsEarned}:</span>
                            <span className="text-green-400 font-bold">+{selectedOrder.coinsEarned}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-yellow-500/20 mt-2">
                          <span className="text-gray-300">{lang.remainingPayment}:</span>
                          <span className="text-white">${Math.max(0, (selectedOrder.total || selectedOrder.totalPrice || 0) - ((selectedOrder.coinsDeducted || selectedOrder.coinsUsed || 0) * COIN_USD_VALUE)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Change */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <CreditCard size={14} /> {lang.statusChange}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <StatusBadge status={selectedOrder.status} locale={locale} />
                      {nextStatuses.length > 0 && (
                        <span className="text-gray-500"><ChevronRight size={16} /></span>
                      )}
                      {nextStatuses.map(s => (
                        <span key={s} className="text-gray-400 text-xs border border-dashed border-gray-600 px-2 py-1 rounded-full">
                          {getStatusLabel(s, locale)}
                        </span>
                      ))}
                    </div>

                    {selectedOrder.status === 'pending_verification' ? (
                      <div className="flex gap-3">
                        <button onClick={() => handleConfirmPayment(selectedOrder.id || selectedOrder.orderId)} disabled={processingAction}
                          className="flex-1 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                          <Check size={18} /> {lang.confirm}
                        </button>
                        <button onClick={() => handleCancelPayment(selectedOrder.id || selectedOrder.orderId)} disabled={processingAction}
                          className="flex-1 py-3.5 bg-red-600/50 text-white font-bold rounded-xl hover:bg-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                          <X size={18} /> {lang.cancel}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#ccff00]/50">
                          {Object.keys(STATUS_LABELS).map(s => (
                            <option key={s} value={s} className="bg-[#111]" disabled={s === selectedOrder.status}>
                              {getStatusIcon(s)} {getStatusLabel(s, locale)}
                            </option>
                          ))}
                        </select>

                        {(newStatus === 'shipped' || newStatus === 'in_transit') && (
                          <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                            <h5 className="text-gray-400 text-xs font-medium flex items-center gap-2">
                              <Truck size={14} /> {lang.tracking}
                            </h5>
                            <input placeholder={lang.trackCode} value={trackCode} onChange={e => setTrackCode(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#ccff00]/50" />
                            <input placeholder={lang.trackCompany} value={trackCompany} onChange={e => setTrackCompany(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#ccff00]/50" />
                            <input type="date" value={estimatedDate} onChange={e => setEstimatedDate(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#ccff00]/50" />
                          </div>
                        )}

                        <div>
                          <input placeholder="Izoh (ixtiyoriy)" value={note} onChange={e => setNote(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#ccff00]/50" />
                        </div>

                        <button onClick={handleStatusChange} disabled={newStatus === selectedOrder.status}
                          className="w-full py-3.5 bg-[#ccff00] text-black font-bold rounded-xl disabled:opacity-30 hover:bg-white transition-all">
                          {lang.update}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status History */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Clock size={14} /> {lang.statusHistory}
                    </h4>
                    <div className="space-y-3">
                      {(selectedOrder.history || []).slice().reverse().map((h, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-[#ccff00] flex-shrink-0" />
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0 font-mono">
                            {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-white font-medium">
                            {getStatusIcon(h.status)} {getStatusLabel(h.status, locale)}
                          </span>
                          {h.note && <span className="text-gray-500 text-xs">- {h.note}</span>}
                        </div>
                      ))}
                      {(selectedOrder.history || []).length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-2">{lang.noOrders}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <CreditCard size={14} /> {lang.payment}
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-400 text-sm">{lang.payment}:</span>
                          {selectedOrder.paymentMethod === 'full' || selectedOrder.paymentMethod === 'card' ? (
                            <span className="text-white">💳 {lang.cardPay || 'Karta'}</span>
                          ) : selectedOrder.paymentMethod === 'coins' ? (
                            <span className="text-yellow-400">🪙 {lang.coinsUsed || 'Coin'}</span>
                          ) : selectedOrder.paymentMethod === 'combined' ? (
                            <span className="text-white">🔄 {lang.combined || 'Coin + Karta'} ({selectedOrder.coinsUsed || 0} coin + ${(selectedOrder.remainingAmount || 0).toFixed(2)})</span>
                          ) : (
                            <span className="text-white">💳 Sberbank QR</span>
                          )}
                        </div>
                        <Row label="Status" value={<StatusBadge status={selectedOrder.status} locale={locale} />} />
                        <Row label="Total" value={<span className="text-[#ccff00] font-bold">${(selectedOrder.total || selectedOrder.totalPrice || 0).toFixed(2)}</span>} />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <h4 className="text-[#ccff00] font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <Calendar size={14} /> {lang.time}
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <Row label="Created" value={new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()} />
                        {selectedOrder.updatedAt && <Row label="Updated" value={new Date(selectedOrder.updatedAt).toLocaleString()} />}
                        {selectedOrder.paidAt && <Row label="Paid" value={new Date(selectedOrder.paidAt).toLocaleString()} />}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
