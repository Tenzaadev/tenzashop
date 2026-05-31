'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, CreditCard, Coins, QrCode,
  Check, Shield, User, MapPin, Package,
  Truck, ChevronRight, Copy, Info, AlertCircle
} from 'lucide-react'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'
import { getUserCoins, calculateCoinReward, COIN_USD_VALUE } from '@/utils/coins'
import {
  generateOrderId, clearCart, getCart,
  autoFillUserProfile, saveProfileData, sendTelegramNotification
} from '@/utils/payment'
import { addOrder, updateOrder } from '@/lib/firestore'
import Header from '../components/Header'
import PaymentSelector from '../components/PaymentSelector'

const L = {
  uz: {
    title: 'Buyurtmani rasmiylashtirish', step1: "Mijoz ma'lumotlari",
    step2: 'To\'lov usuli', step3: 'Tasdiqlash', back: 'Orqaga',
    continue: 'Davom etish', placeOrder: 'Buyurtmani tasdiqlash',
    fullName: 'Ism', email: 'Email', phone: 'Telefon',
    country: 'Davlat', city: 'Shahar', address: 'Manzil',
    postalCode: 'Pochta indeksi', floor: 'Qavat', doorCode: 'Eshik kodi',
    delivery: 'Yetkazib berish', standard: 'Standart', express: 'Express',
    standardEta: '20-30 kun', expressEta: '10-15 kun',
    standardPrice: 'Bepul', expressPrice: '$10',
    paymentMethod: 'To\'lov usuli', cardFull: 'Karta orqali to\'lash',
    coinsFull: 'Coin orqali to\'lash', combined: 'Coin + Karta',
    payWithCard: 'Karta orqali to\'lang', remaining: 'Qolgan to\'lov',
    confirmPay: 'To\'ladim ✅', scanQR: 'QR kodni ko\'rsatish',
    total: 'Jami', order: 'Buyurtma', products: 'Mahsulotlar',
    summary: 'Buyurtma xulosasi', coinUsed: 'Ishlatilgan coin',
    coinsEarned: 'Qo\'shilgan coin', welcome: 'Xush kelibsiz',
    autoFilled: 'Ma\'lumotlaringiz avtomatik to\'ldirildi',
    orderPlaced: 'Buyurtma qabul qilindi!', security: 'To\'lovlar xavfsiz shifrlangan',
    cartEmpty: 'Savat bo\'sh', continueShopping: 'Xaridni davom ettirish',
    required: 'Majburiy maydon', invalidEmail: 'Noto\'g\'ri email',
    invalidPhone: 'Noto\'g\'ri telefon', selected: 'Tanlandi',
    payAmount: 'miqdorida to\'lov qiling', scanSber: 'Sberbank ilovasi orqali skanerlang',
    paidReceived: 'To\'lov qabul qilindi!', adminVerify: 'Admin tekshirib tasdiqlaydi',
    useCoin: 'Coin ishlatish', coinBalance: 'Balans',
    howManyCoins: 'Nechta coin ishlatmaysiz?', orderTotal: 'Buyurtma summasi',
    discount: 'Coin chegirmasi', cardPay: 'Karta orqali to\'lov',
    welcomeBack: 'Xush kelibsiz', confirmOrder: 'Buyurtmani tasdiqlash',
    purchaseReward: "Xaridingiz uchun sovg'a", bonusCoins: 'Bonus coin',
    afterPurchase: "To'lovdan keyingi balans", deliveryFree: 'Bepul',
    coinsUsedBreakdown: 'Coin orqali', cardPayBreakdown: 'Karta orqali',
    totalPay: 'Jami to\'lov',
    telegramContact: 'Boshqa davlatlarga yetkazish uchun Telegramdan @tenza_me ga yoki podderjkaga yozing',
    telegramFooter: 'Boshqa davlatlarga yetkazish uchun Telegramdan bog\'laning',
  },
  ru: {
    title: 'Оформление заказа', step1: 'Данные клиента',
    step2: 'Способ оплаты', step3: 'Подтверждение', back: 'Назад',
    continue: 'Продолжить', placeOrder: 'Подтвердить заказ',
    fullName: 'Имя', email: 'Email', phone: 'Телефон',
    country: 'Страна', city: 'Город', address: 'Адрес',
    postalCode: 'Почтовый индекс', floor: 'Этаж', doorCode: 'Код двери',
    delivery: 'Доставка', standard: 'Стандартная', express: 'Экспресс',
    standardEta: '20-30 дней', expressEta: '10-15 дней',
    standardPrice: 'Бесплатно', expressPrice: '$10',
    paymentMethod: 'Способ оплаты', cardFull: 'Оплата картой',
    coinsFull: 'Оплата коинами', combined: 'Монеты + Карта',
    payWithCard: 'Оплатите картой', remaining: 'Остаток к оплате',
    confirmPay: 'Я оплатил ✅', scanQR: 'Показать QR код',
    total: 'Итого', order: 'Заказ', products: 'Товары',
    summary: 'Итого по заказу', coinUsed: 'Использовано монет',
    coinsEarned: 'Начислено монет', welcome: 'Добро пожаловать',
    autoFilled: 'Ваши данные заполнены автоматически',
    orderPlaced: 'Заказ принят!', security: 'Платежи защищены шифрованием',
    cartEmpty: 'Корзина пуста', continueShopping: 'Продолжить покупки',
    required: 'Обязательное поле', invalidEmail: 'Неверный email',
    invalidPhone: 'Неверный телефон', selected: 'Выбрано',
    payAmount: 'оплатите сумму', scanSber: 'Сканируйте через приложение Сбербанк',
    paidReceived: 'Платёж получен!', adminVerify: 'Администратор проверит и подтвердит',
    useCoin: 'Использовать монеты', coinBalance: 'Баланс',
    howManyCoins: 'Сколько монет использовать?', orderTotal: 'Сумма заказа',
    discount: 'Скидка монетами', cardPay: 'Оплата картой',
    welcomeBack: 'С возвращением', confirmOrder: 'Подтвердить заказ',
    purchaseReward: 'Подарок за покупку', bonusCoins: 'Бонусные монеты',
    afterPurchase: 'Баланс после покупки', deliveryFree: 'Бесплатно',
    coinsUsedBreakdown: 'Монетами', cardPayBreakdown: 'Картой',
    totalPay: 'Итого к оплате',
    telegramContact: 'Для доставки в другие страны напишите в Telegram @tenza_me или в поддержку',
    telegramFooter: 'Для доставки в другие страны свяжитесь через Telegram',
  },
  en: {
    title: 'Checkout', step1: 'Customer Details',
    step2: 'Payment Method', step3: 'Confirmation', back: 'Back',
    continue: 'Continue', placeOrder: 'Confirm Order',
    fullName: 'Full Name', email: 'Email', phone: 'Phone',
    country: 'Country', city: 'City', address: 'Address',
    postalCode: 'Postal Code', floor: 'Floor', doorCode: 'Door Code',
    delivery: 'Delivery', standard: 'Standard', express: 'Express',
    standardEta: '20-30 days', expressEta: '10-15 days',
    standardPrice: 'Free', expressPrice: '$10',
    paymentMethod: 'Payment Method', cardFull: 'Pay by card',
    coinsFull: 'Pay with coins', combined: 'Coins + Card',
    payWithCard: 'Pay with card', remaining: 'Remaining',
    confirmPay: 'I paid ✅', scanQR: 'Show QR code',
    total: 'Total', order: 'Order', products: 'Products',
    summary: 'Order Summary', coinUsed: 'Coins used',
    coinsEarned: 'Coins earned', welcome: 'Welcome',
    autoFilled: 'Your details were auto-filled',
    orderPlaced: 'Order received!', security: 'Payments are securely encrypted',
    cartEmpty: 'Cart is empty', continueShopping: 'Continue Shopping',
    required: 'Required field', invalidEmail: 'Invalid email',
    invalidPhone: 'Invalid phone', selected: 'Selected',
    payAmount: 'Pay the amount of', scanSber: 'Scan with Sberbank app',
    paidReceived: 'Payment received!', adminVerify: 'Admin will verify and confirm',
    useCoin: 'Use coins', coinBalance: 'Balance',
    howManyCoins: 'How many coins to use?', orderTotal: 'Order total',
    discount: 'Coin discount', cardPay: 'Card payment',
    welcomeBack: 'Welcome back', confirmOrder: 'Confirm order',
    purchaseReward: 'Purchase reward', bonusCoins: 'Bonus coins',
    afterPurchase: 'Balance after purchase', deliveryFree: 'Free',
    coinsUsedBreakdown: 'By coins', cardPayBreakdown: 'By card',
    totalPay: 'Total to pay',
    telegramContact: 'For delivery to other countries, contact @tenza_me on Telegram or support',
    telegramFooter: 'For delivery to other countries, contact via Telegram',
  },
  fi: {
    title: 'Kassa', step1: 'Asiakastiedot',
    step2: 'Maksutapa', step3: 'Vahvistus', back: 'Takaisin',
    continue: 'Jatka', placeOrder: 'Vahvista tilaus',
    fullName: 'Nimi', email: 'Sähköposti', phone: 'Puhelin',
    country: 'Maa', city: 'Kaupunki', address: 'Osoite',
    postalCode: 'Postinumero', floor: 'Kerros', doorCode: 'Ovikoodi',
    delivery: 'Toimitus', standard: 'Normaali', express: 'Pikatoimitus',
    standardEta: '20-30 päivää', expressEta: '10-15 päivää',
    standardPrice: 'Ilmainen', expressPrice: '$10',
    paymentMethod: 'Maksutapa', cardFull: 'Maksa kortilla',
    coinsFull: 'Maksa kolikoilla', combined: 'Kolikot + Kortti',
    payWithCard: 'Maksa kortilla', remaining: 'Jäljellä',
    confirmPay: 'Maksoin ✅', scanQR: 'Näytä QR-koodi',
    total: 'Yhteensä', order: 'Tilaus', products: 'Tuotteet',
    summary: 'Tilausyhteenveto', coinUsed: 'Käytetyt kolikot',
    coinsEarned: 'Ansaitut kolikot', welcome: 'Tervetuloa',
    autoFilled: 'Tietosi täytettiin automaattisesti',
    orderPlaced: 'Tilaus vastaanotettu!', security: 'Maksut on suojattu salauksella',
    cartEmpty: 'Ostoskori on tyhjä', continueShopping: 'Jatka ostoksia',
    required: 'Pakollinen kenttä', invalidEmail: 'Virheellinen sähköposti',
    invalidPhone: 'Virheellinen puhelin', selected: 'Valittu',
    payAmount: 'Maksa summa', scanSber: 'Skannaa Sberbank-sovelluksella',
    paidReceived: 'Maksu vastaanotettu!', adminVerify: 'Ylläpitäjä vahvistaa',
    useCoin: 'Käytä kolikoita', coinBalance: 'Saldo',
    howManyCoins: 'Kuinka monta kolikkoa käytetään?', orderTotal: 'Tilauksen summa',
    discount: 'Kolikkoalennus', cardPay: 'Korttimaksu',
    welcomeBack: 'Tervetuloa takaisin', confirmOrder: 'Vahvista tilaus',
    purchaseReward: 'Ostolahja', bonusCoins: 'Bonuskolikot',
    afterPurchase: 'Saldo oston jälkeen', deliveryFree: 'Ilmainen',
    coinsUsedBreakdown: 'Kolikoilla', cardPayBreakdown: 'Kortilla',
    totalPay: 'Maksettava yhteensä',
    telegramContact: 'Ota yhteyttä Telegramissa @tenza_me tai tukeen toimituksista muihin maihin',
    telegramFooter: 'Ota yhteyttä Telegramin kautta toimituksista muihin maihin',
  },
  sv: {
    title: 'Kassa', step1: 'Kunduppgifter',
    step2: 'Betalningsmetod', step3: 'Bekräftelse', back: 'Tillbaka',
    continue: 'Fortsätt', placeOrder: 'Bekräfta beställning',
    fullName: 'Namn', email: 'E-post', phone: 'Telefon',
    country: 'Land', city: 'Stad', address: 'Adress',
    postalCode: 'Postnummer', floor: 'Våning', doorCode: 'Portkod',
    delivery: 'Leverans', standard: 'Standard', express: 'Express',
    standardEta: '20-30 dagar', expressEta: '10-15 dagar',
    standardPrice: 'Gratis', expressPrice: '$10',
    paymentMethod: 'Betalningsmetod', cardFull: 'Betala med kort',
    coinsFull: 'Betala med mynt', combined: 'Mynt + Kort',
    payWithCard: 'Betala med kort', remaining: 'Återstående',
    confirmPay: 'Jag betalade ✅', scanQR: 'Visa QR-kod',
    total: 'Totalt', order: 'Beställning', products: 'Produkter',
    summary: 'Ordersammanfattning', coinUsed: 'Använda mynt',
    coinsEarned: 'Förtjänade mynt', welcome: 'Välkommen',
    autoFilled: 'Dina uppgifter fylldes i automatiskt',
    orderPlaced: 'Beställning mottagen!', security: 'Betalningar är krypterade',
    cartEmpty: 'Varukorgen är tom', continueShopping: 'Fortsätt handla',
    required: 'Obligatoriskt fält', invalidEmail: 'Ogiltig e-post',
    invalidPhone: 'Ogiltig telefon', selected: 'Vald',
    payAmount: 'Betala beloppet', scanSber: 'Skanna med Sberbank-appen',
    paidReceived: 'Betalning mottagen!', adminVerify: 'Admin verifierar och bekräftar',
    useCoin: 'Använd mynt', coinBalance: 'Saldo',
    howManyCoins: 'Hur många mynt vill du använda?', orderTotal: 'Ordersumma',
    discount: 'Myntrabatt', cardPay: 'Kortbetalning',
    welcomeBack: 'Välkommen tillbaka', confirmOrder: 'Bekräfta beställning',
    purchaseReward: 'Köpgåva', bonusCoins: 'Bonusmynt',
    afterPurchase: 'Saldo efter köp', deliveryFree: 'Gratis',
    coinsUsedBreakdown: 'Med mynt', cardPayBreakdown: 'Med kort',
    totalPay: 'Totalt att betala',
    telegramContact: 'Kontakta @tenza_me på Telegram eller support för leverans till andra länder',
    telegramFooter: 'Kontakta via Telegram för leverans till andra länder',
  },
}

export default function CheckoutPage() {
  const { locale, t } = useI18n()
  const { user, addPurchaseBonus } = useAuth()
  const ll = L[locale] || L.en

  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [userCoins, setUserCoins] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    country: 'fi', city: '', address: '', postalCode: '',
    floor: '', doorCode: '', delivery: 'standard',
  })

  const [paymentMethod, setPaymentMethod] = useState('full')
  const [useCoins, setUseCoins] = useState(false)
  const [coinsToUse, setCoinsToUse] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [qrPaid, setQrPaid] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState(null)
  const [pendingOrderRef, setPendingOrderRef] = useState(null)

  useEffect(() => {
    const cart = getCart()
    setCartItems(cart)
    const coins = getUserCoins(user?.email || user?.login) || 0
    setUserCoins(coins)
    const profile = autoFillUserProfile()
    if (profile.customerName || profile.customerEmail) {
      setForm(f => ({ ...f, ...profile }))
      setAutoFilled(true)
    }
  }, [user])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCost = form.delivery === 'express' ? 10 : 0
  const orderTotal = subtotal + deliveryCost
  const remainingAfterCoins = Math.max(0, orderTotal - (coinsToUse * COIN_USD_VALUE))
  const maxCoins = Math.min(userCoins, Math.ceil(orderTotal / COIN_USD_VALUE))
  const isFinland = form.country === 'fi'
  const bonus = calculateCoinReward(orderTotal)
  const coinEquiv = (c) => {
    const u = (c * 0.005).toFixed(2)
    const s = Math.round(c * 50).toLocaleString()
    const r = Math.round(c * 0.45)
    return `~$${u} / ~${s} so'm / ~${r}₽`
  }
  const coinsAfterPurchase = userCoins - coinsToUse + bonus

  const validateStep1 = () => {
    const e = {}
    if (!form.customerName.trim()) e.customerName = ll.required
    if (!form.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) e.customerEmail = ll.invalidEmail
    if (!form.customerPhone.trim() || !/^\+?[0-9\s\-()]{7,}$/.test(form.customerPhone)) e.customerPhone = ll.invalidPhone
    if (!form.city.trim()) e.city = ll.required
    if (!form.address.trim()) e.address = ll.required
    if (isFinland && !form.postalCode.trim()) e.postalCode = ll.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    if (submitting) return
    setSubmitting(true)

    const orderId = generateOrderId()
    const order = {
      id: orderId,
      orderId,
      customerName: form.customerName,
      fullName: form.customerName,
      email: form.customerEmail,
      phone: form.customerPhone,
      country: form.country,
      city: form.city,
      address: form.address,
      postalCode: form.postalCode,
      floor: form.floor,
      doorCode: form.doorCode,
      items: cartItems,
      subtotal,
      delivery: form.delivery,
      deliveryCost,
      total: orderTotal,
      paymentMethod: useCoins ? (remainingAfterCoins <= 0 ? 'coins' : 'combined') : 'full',
      coinsUsed: useCoins ? coinsToUse : 0,
      coinsEarned: 0,
      remainingAmount: remainingAfterCoins,
      login: user?.login || form.customerEmail,
      status: 'pending_verification',
      history: [{ status: 'pending_verification', time: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    }

    await addOrder(order)
    fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {})
    saveProfileData(form)
    clearCart()
    localStorage.setItem('tenza_user_email', form.customerEmail)
    sendTelegramNotification(order)

    if (user?.login) {
      await addPurchaseBonus(user.login, order.total)
    }

    window.location.href = `/success?order=${orderId}&email=${encodeURIComponent(form.customerEmail)}&coins=0&status=pending_verification`
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-white text-2xl font-bold mb-4">{ll.cartEmpty}</p>
          <Link href="/" className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-full">{ll.continueShopping}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/cart" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-sm lg:text-base">{ll.title}</h1>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all ${step >= s ? 'bg-[#ccff00] scale-110' : 'bg-gray-700'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {[
            { num: 1, label: ll.step1, icon: '👤' },
            { num: 2, label: ll.step2, icon: '💳' },
            { num: 3, label: ll.step3, icon: '✅' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                step >= s.num ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-500'
              }`}>
                <span>{s.icon}</span>
                <span className="hidden md:inline">{s.label}</span>
              </div>
              {s.num < 3 && <ChevronRight size={14} className="text-gray-600" />}
            </div>
          ))}
        </div>

        {/* STEP 1: Customer Details */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              {autoFilled && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium">{ll.welcomeBack}, {form.customerName}!</p>
                    <p className="text-gray-400 text-sm">{ll.autoFilled}</p>
                  </div>
                </div>
              )}

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={20} className="text-[#ccff00]" /> {ll.step1}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { key: 'customerName', label: ll.fullName, type: 'text', required: true },
                    { key: 'customerEmail', label: ll.email, type: 'email', required: true },
                    { key: 'customerPhone', label: ll.phone, type: 'tel', required: true },
                    { key: 'country', label: ll.country, type: 'select', required: true,
                      options: [
                        { value: 'fi', label: '🇫🇮 Finland' },
                        { value: 'se', label: '🇸🇪 Sweden' },
                        { value: 'uz', label: "🇺🇿 O'zbekiston" },
                        { value: 'ru', label: '🇷🇺 Russia' },
                        { value: 'other', label: '🌍 Other' },
                      ]
                    },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-gray-400 mb-1 block">{f.label}{f.required ? ' *' : ''}</label>
                      {f.type === 'select' ? (
                        <select value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50">
                          {f.options.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a0a]">{o.label}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                          className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50`} />
                      )}
                      {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin size={20} className="text-[#ccff00]" /> {ll.address}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">{ll.address} *</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                      className={`w-full bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50`} />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">{ll.city} *</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                      className={`w-full bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50`} />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">{ll.postalCode} {isFinland ? '*' : ''}</label>
                    <input value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})}
                      className={`w-full bg-white/5 border ${errors.postalCode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50`} />
                    {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                  {isFinland && (
                    <>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">{ll.floor}</label>
                        <input value={form.floor} onChange={e => setForm({...form, floor: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">{ll.doorCode}</label>
                        <input value={form.doorCode} onChange={e => setForm({...form, doorCode: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Truck size={20} className="text-[#ccff00]" /> {ll.delivery}
                </h2>
                {[
                  { id: 'standard', icon: '🚚', label: ll.standard, eta: ll.standardEta, price: 0, priceLbl: ll.standardPrice },
                  { id: 'express', icon: '✈️', label: ll.express, eta: ll.expressEta, price: 10, priceLbl: ll.expressPrice },
                ].map(d => (
                  <label key={d.id} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    form.delivery === d.id ? 'border-[#ccff00] bg-[#ccff00]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                  }`}>
                    <input type="radio" name="delivery" checked={form.delivery === d.id} onChange={() => setForm({...form, delivery: d.id})} className="hidden" />
                    <span className="text-2xl">{d.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold">{d.label}</p>
                      <p className="text-gray-500 text-xs">{d.eta}</p>
                    </div>
                    <span className={`font-bold text-sm ${d.price === 0 ? 'text-green-400' : 'text-[#ccff00]'}`}>{d.priceLbl}</span>
                  </label>
                ))}
                {!['fi', 'se'].includes(form.country) && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-200 text-xs">{ll.telegramContact}</p>
                  </div>
                )}
              </div>

              {!['fi', 'se'].includes(form.country) && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 text-center">
                  <p className="text-yellow-200 text-sm font-medium">📨 {ll.telegramFooter}</p>
                </div>
              )}

              <button onClick={() => { if (validateStep1()) setStep(2) }}
                className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all">
                {ll.continue} &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
              {/* Order Summary */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2 text-sm">
                      <Package size={16} className="text-[#ccff00]" /> {ll.summary}
                    </h2>
                    {coinsToUse > 0 && <span className="text-yellow-400 text-xs font-medium">({coinsToUse} coin)</span>}
                  </div>
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id || item._id} className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm truncate mr-3">
                          {typeof item.name === 'string' ? item.name : item.name?.[locale] || item.name?.en}
                          <span className="text-gray-600 ml-1">x{item.quantity}</span>
                        </span>
                        <span className="text-white text-sm font-medium flex-shrink-0">${(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                    <span className="text-gray-500">{ll.delivery}</span>
                    <span className="text-white">{deliveryCost > 0 ? `$${deliveryCost}` : ll.deliveryFree}</span>
                  </div>
                  {coinsToUse > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{ll.coinsUsedBreakdown}</span>
                      <span className="text-yellow-400 font-medium">-${(coinsToUse * COIN_USD_VALUE).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-3 border-t border-white/10">
                    <span>{ll.totalPay}</span>
                    <span className="text-[#ccff00] text-lg">${remainingAfterCoins.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h2 className="font-bold flex items-center gap-2 text-sm">
                    <CreditCard size={16} className="text-[#ccff00]" /> {ll.paymentMethod}
                  </h2>
                </div>
                <div className="p-5 space-y-2.5">
                  {/* Card */}
                  <button onClick={() => { setPaymentMethod('full'); setUseCoins(false); setCoinsToUse(0) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      paymentMethod === 'full'
                        ? 'border-[#ccff00] bg-[#ccff00]/5 shadow-[0_0_15px_rgba(204,255,0,0.05)]'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}>
                    <span className="text-2xl">💳</span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-bold text-sm">{ll.cardFull}</p>
                      <p className="text-gray-500 text-xs">${orderTotal} {ll.payAmount}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      paymentMethod === 'full' ? 'border-[#ccff00]' : 'border-gray-700'
                    }`}>
                      {paymentMethod === 'full' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#ccff00]" />}
                    </div>
                  </button>

                  {/* Coins Only */}
                  {(userCoins * COIN_USD_VALUE) >= orderTotal && (
                    <button onClick={() => { setPaymentMethod('coins'); setUseCoins(true); setCoinsToUse(Math.ceil(orderTotal / COIN_USD_VALUE)) }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        paymentMethod === 'coins'
                          ? 'border-yellow-500 bg-yellow-500/5 shadow-[0_0_15px_rgba(255,200,0,0.05)]'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}>
                      <span className="text-2xl">🪙</span>
                      <div className="flex-1 text-left">
                        <p className="text-white font-bold text-sm">{ll.coinsFull}</p>
                        <p className="text-gray-500 text-xs">{Math.ceil(orderTotal / COIN_USD_VALUE)} coin <span className="text-gray-600 mx-1">|</span> {ll.coinBalance}: <span className="text-yellow-400 font-medium">{userCoins}</span></p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === 'coins' ? 'border-yellow-500' : 'border-gray-700'
                      }`}>
                        {paymentMethod === 'coins' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-yellow-500" />}
                      </div>
                    </button>
                  )}

                  {/* Combined (always show if user has coins) */}
                  {userCoins > 0 && (
                    <button onClick={() => { setPaymentMethod('combined'); setUseCoins(true); setCoinsToUse(Math.min(userCoins, Math.floor(orderTotal / 2 / COIN_USD_VALUE))) }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        paymentMethod === 'combined'
                          ? 'border-[#ccff00] bg-[#ccff00]/5 shadow-[0_0_15px_rgba(204,255,0,0.05)]'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}>
                      <span className="text-2xl">🔄</span>
                      <div className="flex-1 text-left">
                        <p className="text-white font-bold text-sm">{ll.combined}</p>
                        <p className="text-gray-500 text-xs">{maxCoins} coin + ${Math.max(0, orderTotal - (maxCoins * COIN_USD_VALUE)).toFixed(2)} {ll.cardPayBreakdown.toLowerCase()}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === 'combined' ? 'border-[#ccff00]' : 'border-gray-700'
                      }`}>
                        {paymentMethod === 'combined' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#ccff00]" />}
                      </div>
                    </button>
                  )}

                  {/* Not enough coins notice */}
                  {userCoins > 0 && (userCoins * COIN_USD_VALUE) < orderTotal && paymentMethod === 'full' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
                      <Info size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-400 text-xs">
                        Sizda <span className="text-yellow-400 font-medium">{userCoins} coin</span> bor.
                    <button onClick={() => { setPaymentMethod('combined'); setUseCoins(true); setCoinsToUse(Math.min(userCoins, Math.floor(orderTotal / 2 / COIN_USD_VALUE))) }}
                          className="text-[#ccff00] hover:underline ml-1 font-medium">
                          {ll.combined} usulini tanlang
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Combined coin slider */}
              {useCoins && paymentMethod === 'combined' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-2xl overflow-hidden">
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          <Coins size={16} className="text-yellow-400" />
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">{ll.useCoin}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-lg">${(coinsToUse * COIN_USD_VALUE).toFixed(2)}</span>
                        <span className="text-gray-500 text-xs ml-1">({coinsToUse} coin)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input type="range" min={1} max={maxCoins} value={coinsToUse}
                        onChange={e => { setCoinsToUse(parseInt(e.target.value)) }}
                        className="w-full accent-[#ccff00] h-2 rounded-full appearance-none bg-white/10" />
                      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                        <span>${(1 * COIN_USD_VALUE).toFixed(3)}</span>
                        <span>${(maxCoins * COIN_USD_VALUE).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{ll.orderTotal}</span>
                        <span className="text-white">${orderTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{ll.coinsUsedBreakdown}</span>
                        <span className="text-yellow-400 font-medium">-${(coinsToUse * COIN_USD_VALUE).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2.5 border-t border-white/10 mt-2">
                        <span>{ll.cardPay}</span>
                        <span className="text-[#ccff00]">${remainingAfterCoins.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loyalty Bonus Display */}
              {bonus > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-[#ccff00]/5 to-green-500/5 border border-[#ccff00]/20 rounded-2xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold">+{bonus} {ll.bonusCoins}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{coinEquiv(bonus)}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{ll.purchaseReward}. {ll.adminVerify}</p>
                        <p className="text-gray-600 text-[11px] mt-1">{ll.afterPurchase}: <span className="text-yellow-400 font-medium">{coinsAfterPurchase} coin</span></p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Country-based payment */}
              {remainingAfterCoins > 0 && !paymentCompleted && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/5">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <CreditCard size={16} className="text-[#ccff00]" /> {ll.payWithCard}
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {pendingOrderId ? (
                      <PaymentSelector
                        amount={remainingAfterCoins}
                        orderId={pendingOrderId}
                        country={form.country}
                        currency={form.country === 'fi' ? 'eur' : 'usd'}
                        customerEmail={form.customerEmail}
                        onPaid={async () => {
                          setPaymentCompleted(true)
                          const currentOrder = pendingOrderRef
                          if (currentOrder) {
                            await updateOrder(pendingOrderId, {
                              status: 'paid',
                              paidAt: new Date().toISOString(),
                              paymentMethod: form.country === 'fi' ? 'stripe' : form.country === 'uz' ? 'payme' : 'sberbank',
                              history: [...(currentOrder.history || []), { status: 'paid', time: new Date().toISOString(), note: 'Auto-verified payment' }],
                            })
                          }
                          fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: pendingOrderId, status: 'paid' }) }).catch(() => {})
                          saveProfileData(form)
                          clearCart()
                          localStorage.setItem('tenza_user_email', form.customerEmail)
                          if (user?.login) {
                            await addPurchaseBonus(user.login, orderTotal)
                          }
                          window.location.href = `/success?order=${pendingOrderId}&email=${encodeURIComponent(form.customerEmail)}&coins=${coinsToUse}&status=paid`
                        }}
                        onError={(msg) => console.error('Payment error:', msg)}
                      />
                    ) : (
                      <button onClick={async () => {
                        const orderId = generateOrderId()
                        const order = {
                          id: orderId, orderId, customerName: form.customerName,
                          fullName: form.customerName, email: form.customerEmail, phone: form.customerPhone,
                          country: form.country, city: form.city, address: form.address,
                          postalCode: form.postalCode, floor: form.floor, doorCode: form.doorCode,
                          items: cartItems, subtotal, delivery: form.delivery, deliveryCost,
                          total: orderTotal, paymentMethod: 'card',
                          coinsUsed: useCoins ? coinsToUse : 0, coinsEarned: 0,
                          remainingAmount: remainingAfterCoins, login: user?.login || form.customerEmail,
                          status: 'pending_payment',
                          history: [{ status: 'pending_payment', time: new Date().toISOString() }],
                          createdAt: new Date().toISOString(),
                        }
                        setPendingOrderId(orderId)
                        setPendingOrderRef(order)
                        await addOrder(order)
                        fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {})
                        sendTelegramNotification(order)
                      }}
                        className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl text-sm hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2">
                        <CreditCard size={20} /> {ll.payWithCard}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {paymentCompleted && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                  <p className="text-green-400 font-bold text-lg">{ll.paidReceived}</p>
                  <p className="text-gray-400 text-sm mt-1">{ll.adminVerify}</p>
                </div>
              )}

              {/* Coins-only success notice */}
              {useCoins && remainingAfterCoins <= 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-2xl overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                      <Coins size={32} className="text-yellow-400" />
                    </div>
                    <p className="text-white font-bold text-lg">{ll.coinsFull}</p>
                    <p className="text-gray-400 text-sm mt-1">{Math.ceil(orderTotal / COIN_USD_VALUE)} coin {ll.coinUsed}</p>
                    <p className="text-gray-600 text-xs mt-1">{coinEquiv(Math.ceil(orderTotal / COIN_USD_VALUE))}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2 text-gray-600 text-xs justify-center">
                <Shield size={14} />
                <span>{ll.security}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
                  &larr; {ll.back}
                </button>
                <button onClick={handlePlaceOrder} disabled={(remainingAfterCoins > 0 && !paymentCompleted) || submitting}
                  className="flex-[2] py-4 bg-[#ccff00] text-black font-bold rounded-2xl disabled:opacity-30 text-sm hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2">
                  {submitting ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> ...</span>
                  ) : (
                    <>{ll.placeOrder}</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
