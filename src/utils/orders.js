'use client'

export const STATUS_FLOW = [
  'pending_verification',
  'paid',
  'processing',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled'
]

export const STATUS_LABELS = {
  pending_verification: {
    uz: '\u23F3 To\'lov kutilmoqda',
    ru: '\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043E\u043F\u043B\u0430\u0442\u044B',
    en: 'Payment pending',
    fi: 'Maksua odotetaan',
    sv: 'Betalning v\u00E4ntar'
  },
  paid: {
    uz: '\u2705 To\'lov tasdiqlandi',
    ru: '\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430',
    en: 'Payment confirmed',
    fi: 'Maksu vahvistettu',
    sv: 'Betalning bekräftad'
  },
  cancelled: {
    uz: '\u274C To\'lov tasdiqlanmadi',
    ru: '\u041E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430',
    en: 'Payment rejected',
    fi: 'Maksu hyl\u00E4tty',
    sv: 'Betalning avvisad'
  },
  processing: {
    uz: '\uD83D\uDCE6 Tayyorlanmoqda',
    ru: '\u0413\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F',
    en: 'Processing',
    fi: 'K\u00E4sitell\u00E4\u00E4n',
    sv: 'Bearbetas'
  },
  shipped: {
    uz: '\uD83D\uDE9A Jo\'natildi',
    ru: '\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D',
    en: 'Shipped',
    fi: 'L\u00E4hetetty',
    sv: 'Skickad'
  },
  in_transit: {
    uz: '\u2708\uFE0F Yo\'lda',
    ru: '\u0412 \u043F\u0443\u0442\u0438',
    en: 'In transit',
    fi: 'Matkalla',
    sv: 'Under transport'
  },
  delivered: {
    uz: '\uD83C\uDFE0 Yetkazildi',
    ru: '\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D',
    en: 'Delivered',
    fi: 'Toimitettu',
    sv: 'Levererad'
  }
}

export const STATUS_STYLES = {
  pending_verification: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  paid: 'text-green-400 border-green-500/30 bg-green-500/10',
  cancelled: 'text-red-400 border-red-500/30 bg-red-500/10',
  processing: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  shipped: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  in_transit: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  delivered: 'text-green-400 border-green-500/30 bg-green-500/10',
}

export const STATUS_ICONS = {
  pending_verification: '\u23F3',
  paid: '\u2705',
  cancelled: '\u274C',
  processing: '\uD83D\uDCE6',
  shipped: '\uD83D\uDE9A',
  in_transit: '\u2708\uFE0F',
  delivered: '\uD83C\uDFE0',
}

export function getStatusLabel(status, locale) {
  const labels = STATUS_LABELS[status]
  if (!labels) return status
  return labels[locale] || labels.en || status
}

export function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.pending_verification
}

export function getStatusIcon(status) {
  return STATUS_ICONS[status] || '\u2753'
}

export function getAllStatuses() {
  return Object.keys(STATUS_LABELS)
}

export function getOrders() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('tenza_orders') || '[]')
  } catch { return [] }
}

export function getPendingOrders() {
  return getOrders().filter(o => o.status === 'pending_verification')
}

export function saveOrder(orderData) {
  const orders = getOrders()
  const order = {
    ...orderData,
    id: 'TENZA-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    coinsEarned: 0,
    history: [{ status: 'pending_verification', time: new Date().toISOString() }]
  }
  orders.unshift(order)
  localStorage.setItem('tenza_orders', JSON.stringify(orders))
  return order
}

export function updateOrderInStorage(orderId, updates) {
  const orders = getOrders()
  const idx = orders.findIndex(o => (o.id || o.orderId) === orderId)
  if (idx < 0) return null
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() }
  localStorage.setItem('tenza_orders', JSON.stringify(orders))
  return orders[idx]
}

export function getNextValidStatuses(currentStatus) {
  const flow = STATUS_FLOW
  const idx = flow.indexOf(currentStatus)
  if (idx < 0) return []
  if (currentStatus === 'pending_verification') return ['paid', 'cancelled']
  if (currentStatus === 'paid') return ['processing']
  if (currentStatus === 'processing') return ['shipped']
  if (currentStatus === 'shipped') return ['in_transit']
  if (currentStatus === 'in_transit') return ['delivered']
  return []
}

export const NOTIF_MESSAGES = {
  paid: {
    uz: { title: '\u2705 To\'lovingiz tasdiqlandi!', message: (o) => {
      let msg = `Buyurtma #${o.id || o.orderId} tasdiqlandi.`
      if (o.coinsUsed > 0) msg += `\n-${o.coinsUsed} coin hisobdan yechildi.`
      if (o.coinsEarned > 0) msg += `\n+${o.coinsEarned} coin qo\'shildi!`
      return msg
    }},
    ru: { title: '\u2705 \u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430!', message: (o) => `\u0417\u0430\u043A\u0430\u0437 #${o.id || o.orderId} \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D.` },
    en: { title: '\u2705 Payment confirmed!', message: (o) => `Order #${o.id || o.orderId} confirmed.` },
    fi: { title: '\u2705 Maksu vahvistettu!', message: (o) => `Tilaus #${o.id || o.orderId} vahvistettu.` },
    sv: { title: '\u2705 Betalning bekräftad!', message: (o) => `Beställning #${o.id || o.orderId} bekräftad.` },
  },
  cancelled: {
    uz: { title: '\u274C To\'lov tasdiqlanmadi', message: 'Buyurtmangiz bekor qilindi. Coin\'laringiz o\'zgarishsiz qoldi.' },
    ru: { title: '\u274C \u041E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430', message: '\u0417\u0430\u043A\u0430\u0437 \u043E\u0442\u043C\u0435\u043D\u0451\u043D. \u0412\u0430\u0448\u0438 \u043C\u043E\u043D\u0435\u0442\u044B \u043E\u0441\u0442\u0430\u043B\u0438\u0441\u044C \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439.' },
    en: { title: '\u274C Payment rejected', message: 'Your order has been cancelled. Your coins remain unchanged.' },
    fi: { title: '\u274C Maksu hylätty', message: 'Tilauksesi on peruttu. Kolikkosi pysyvät ennallaan.' },
    sv: { title: '\u274C Betalning avvisad', message: 'Din beställning har avbrutits. Dina mynt förblir oförändrade.' },
  },
  processing: {
    uz: { title: '\uD83D\uDCE6 Buyurtmangiz tayyorlanmoqda', message: 'Tez orada jo\'natiladi' },
    ru: { title: '\uD83D\uDCE6 \u0417\u0430\u043A\u0430\u0437 \u0433\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F', message: '\u0421\u043A\u043E\u0440\u043E \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D' },
    en: { title: '\uD83D\uDCE6 Order is being prepared', message: 'Will be shipped soon' },
    fi: { title: '\uD83D\uDCE6 Tilausta valmistellaan', message: 'Lähetetään pian' },
    sv: { title: '\uD83D\uDCE6 Beställningen förbereds', message: 'Kommer att skickas snart' },
  },
  shipped: {
    uz: { title: '\uD83D\uDE9A Buyurtmangiz jo\'natildi!', message: (o) => `Track kodi: ${o.tracking?.code || 'Tez orada beriladi'}` },
    ru: { title: '\uD83D\uDE9A \u0417\u0430\u043A\u0430\u0437 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D!', message: (o) => `\u0422\u0440\u0435\u043A-\u043A\u043E\u0434: ${o.tracking?.code || '\u0421\u043A\u043E\u0440\u043E \u0431\u0443\u0434\u0435\u0442'}` },
    en: { title: '\uD83D\uDE9A Your order has been shipped!', message: (o) => `Track code: ${o.tracking?.code || 'Will be provided soon'}` },
    fi: { title: '\uD83D\uDE9A Tilauksesi on lähetetty!', message: (o) => `Seurantakoodi: ${o.tracking?.code || 'Ilmoitetaan pian'}` },
    sv: { title: '\uD83D\uDE9A Din beställning har skickats!', message: (o) => `Spårningskod: ${o.tracking?.code || 'Kommer snart'}` },
  },
  in_transit: {
    uz: { title: '\u2708\uFE0F Buyurtmangiz yo\'lda', message: (o) => `Tahminiy yetkazish: ${o.tracking?.estimatedDelivery || 'Tez orada'}` },
    ru: { title: '\u2708\uFE0F \u0417\u0430\u043A\u0430\u0437 \u0432 \u043F\u0443\u0442\u0438', message: (o) => `\u041F\u0440\u0438\u043C\u0435\u0440\u043D\u0430\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430: ${o.tracking?.estimatedDelivery || '\u0421\u043A\u043E\u0440\u043E'}` },
    en: { title: '\u2708\uFE0F Your order is in transit', message: (o) => `Estimated delivery: ${o.tracking?.estimatedDelivery || 'Soon'}` },
    fi: { title: '\u2708\uFE0F Tilauksesi on matkalla', message: (o) => `Arvioitu toimitus: ${o.tracking?.estimatedDelivery || 'Pian'}` },
    sv: { title: '\u2708\uFE0F Din beställning är under transport', message: (o) => `Beräknad leverans: ${o.tracking?.estimatedDelivery || 'Snart'}` },
  },
  delivered: {
    uz: { title: '\uD83C\uDFE0 Buyurtmangiz yetkazildi!', message: 'Mahsulotingizni baholang va izoh qoldiring' },
    ru: { title: '\uD83C\uDFE0 \u0417\u0430\u043A\u0430\u0437 \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D!', message: '\u041E\u0446\u0435\u043D\u0438\u0442\u0435 \u0442\u043E\u0432\u0430\u0440 \u0438 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043E\u0442\u0437\u044B\u0432' },
    en: { title: '\uD83C\uDFE0 Your order has been delivered!', message: 'Rate your product and leave a review' },
    fi: { title: '\uD83C\uDFE0 Tilauksesi on toimitettu!', message: 'Arvioi tuote ja jätä arvostelu' },
    sv: { title: '\uD83C\uDFE0 Din beställning har levererats!', message: 'Betygsätt din produkt och lämna en recension' },
  },
}

export function getNotifMessage(status, order, locale) {
  const msgs = NOTIF_MESSAGES[status]
  if (!msgs) return null
  const msg = msgs[locale] || msgs.en
  return {
    title: msg.title,
    message: typeof msg.message === 'function' ? msg.message(order) : msg.message
  }
}

export function getOrderStats() {
  const orders = getOrders()
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending_verification').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped' || o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    paid: orders.filter(o => o.status === 'paid').length,
    revenue: orders.reduce((s, o) => s + (o.status === 'delivered' ? (o.total || o.totalPrice || 0) : 0), 0),
    totalRevenue: orders.reduce((s, o) => s + (o.total || o.totalPrice || 0), 0),
  }
}

export function itemName(item, locale) {
  if (typeof item?.name === 'string') return item.name
  return item?.name?.[locale] || item?.name?.en || ''
}
