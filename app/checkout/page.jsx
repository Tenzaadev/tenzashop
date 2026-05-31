'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, CreditCard, Check, Shield, User, MapPin, Package,
  Truck, ChevronRight, AlertCircle, ShoppingBag, Lock
} from 'lucide-react'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'
import {
  generateOrderId, clearCart, getCart,
  autoFillUserProfile, saveProfileData, sendTelegramNotification
} from '@/utils/payment'
import { addOrder, updateOrder } from '@/lib/firestore'
import Header from '../components/Header'
import PaymentSelector from '../components/PaymentSelector'

const L = {
  uz: {
    title: 'Buyurtma', back: 'Orqaga', continue: 'Davom etish',
    fullName: 'Ism', email: 'Email', phone: 'Telefon',
    country: 'Davlat', city: 'Shahar', address: 'Manzil',
    postalCode: 'Pochta indeksi', floor: 'Qavat', doorCode: 'Eshik kodi',
    delivery: 'Yetkazib berish', standard: 'Standart', express: 'Express',
    standardEta: '20-30 kun', expressEta: '10-15 kun',
    standardPrice: 'Bepul', expressPrice: '$10',
    customerInfo: "Ma'lumotlar", deliveryAddr: 'Manzil',
    paymentMethod: "To'lov", summary: 'Buyurtma',
    payWithCard: "To'lovni boshlash",
    paidReceived: "To'lov qabul qilindi!",
    adminVerify: 'Admin tekshirib tasdiqlaydi',
    telegramContact: 'Boshqa davlatlarga yetkazish uchun Telegramdan @tenza_me ga yozing',
    telegramFooter: 'Boshqa davlatlarga yetkazish uchun Telegramdan bog\'laning',
    cartEmpty: 'Savat bo\'sh', continueShopping: 'Xaridni davom ettirish',
    required: 'Majburiy', invalidEmail: 'Noto\'g\'ri email',
    invalidPhone: 'Noto\'g\'ri telefon',
    deliveryFree: 'Bepul', orderAmount: 'Jami',
    yourOrder: 'Sizning buyurtmangiz', security: 'To\'lovlar xavfsiz shifrlangan',
    welcomeBack: 'Xush kelibsiz', autoFilled: 'Ma\'lumotlaringiz avtomatik to\'ldirildi',
    totalPay: 'To\'lov summasi', chooseMethod: 'To\'lov usulini tanlang',
    items: 'mahsulot',
  },
  ru: {
    title: 'Заказ', back: 'Назад', continue: 'Продолжить',
    fullName: 'Имя', email: 'Email', phone: 'Телефон',
    country: 'Страна', city: 'Город', address: 'Адрес',
    postalCode: 'Почтовый индекс', floor: 'Этаж', doorCode: 'Код двери',
    delivery: 'Доставка', standard: 'Стандартная', express: 'Экспресс',
    standardEta: '20-30 дней', expressEta: '10-15 дней',
    standardPrice: 'Бесплатно', expressPrice: '$10',
    customerInfo: 'Данные', deliveryAddr: 'Адрес',
    paymentMethod: 'Оплата', summary: 'Заказ',
    payWithCard: 'Начать оплату',
    paidReceived: 'Платёж получен!',
    adminVerify: 'Администратор проверит и подтвердит',
    telegramContact: 'Для доставки в другие страны напишите в Telegram @tenza_me',
    telegramFooter: 'Для доставки в другие страны свяжитесь через Telegram',
    cartEmpty: 'Корзина пуста', continueShopping: 'Продолжить покупки',
    required: 'Обязательно', invalidEmail: 'Неверный email',
    invalidPhone: 'Неверный телефон',
    deliveryFree: 'Бесплатно', orderAmount: 'Итого',
    yourOrder: 'Ваш заказ', security: 'Платежи защищены шифрованием',
    welcomeBack: 'С возвращением', autoFilled: 'Данные заполнены автоматически',
    totalPay: 'Сумма к оплате', chooseMethod: 'Выберите способ оплаты',
    items: 'товар(а)',
  },
  en: {
    title: 'Checkout', back: 'Back', continue: 'Continue',
    fullName: 'Full Name', email: 'Email', phone: 'Phone',
    country: 'Country', city: 'City', address: 'Address',
    postalCode: 'Postal Code', floor: 'Floor', doorCode: 'Door Code',
    delivery: 'Delivery', standard: 'Standard', express: 'Express',
    standardEta: '20-30 days', expressEta: '10-15 days',
    standardPrice: 'Free', expressPrice: '$10',
    customerInfo: 'Details', deliveryAddr: 'Address',
    paymentMethod: 'Payment', summary: 'Order',
    payWithCard: 'Pay Now',
    paidReceived: 'Payment received!',
    adminVerify: 'Admin will verify and confirm',
    telegramContact: 'For delivery to other countries, contact @tenza_me on Telegram',
    telegramFooter: 'For delivery to other countries, contact via Telegram',
    cartEmpty: 'Cart is empty', continueShopping: 'Continue Shopping',
    required: 'Required', invalidEmail: 'Invalid email',
    invalidPhone: 'Invalid phone',
    deliveryFree: 'Free', orderAmount: 'Total',
    yourOrder: 'Your Order', security: 'Payments are securely encrypted',
    welcomeBack: 'Welcome back', autoFilled: 'Details auto-filled',
    totalPay: 'Total to pay', chooseMethod: 'Choose payment method',
    items: 'items',
  },
  fi: {
    title: 'Kassa', back: 'Takaisin', continue: 'Jatka',
    fullName: 'Nimi', email: 'Sähköposti', phone: 'Puhelin',
    country: 'Maa', city: 'Kaupunki', address: 'Osoite',
    postalCode: 'Postinumero', floor: 'Kerros', doorCode: 'Ovikoodi',
    delivery: 'Toimitus', standard: 'Normaali', express: 'Pikatoimitus',
    standardEta: '20-30 päivää', expressEta: '10-15 päivää',
    standardPrice: 'Ilmainen', expressPrice: '$10',
    customerInfo: 'Tiedot', deliveryAddr: 'Osoite',
    paymentMethod: 'Maksu', summary: 'Tilaus',
    payWithCard: 'Maksa nyt',
    paidReceived: 'Maksu vastaanotettu!',
    adminVerify: 'Ylläpitäjä vahvistaa',
    telegramContact: 'Ota yhteyttä Telegramissa @tenza_me',
    telegramFooter: 'Ota yhteyttä Telegramin kautta',
    cartEmpty: 'Ostoskori on tyhjä', continueShopping: 'Jatka ostoksia',
    required: 'Pakollinen', invalidEmail: 'Virheellinen sähköposti',
    invalidPhone: 'Virheellinen puhelin',
    deliveryFree: 'Ilmainen', orderAmount: 'Yhteensä',
    yourOrder: 'Tilauksesi', security: 'Maksut on suojattu',
    welcomeBack: 'Tervetuloa', autoFilled: 'Tiedot täytetty automaattisesti',
    totalPay: 'Maksettava yhteensä', chooseMethod: 'Valitse maksutapa',
    items: 'tuotetta',
  },
  sv: {
    title: 'Kassa', back: 'Tillbaka', continue: 'Fortsätt',
    fullName: 'Namn', email: 'E-post', phone: 'Telefon',
    country: 'Land', city: 'Stad', address: 'Adress',
    postalCode: 'Postnummer', floor: 'Våning', doorCode: 'Portkod',
    delivery: 'Leverans', standard: 'Standard', express: 'Express',
    standardEta: '20-30 dagar', expressEta: '10-15 dagar',
    standardPrice: 'Gratis', expressPrice: '$10',
    customerInfo: 'Uppgifter', deliveryAddr: 'Adress',
    paymentMethod: 'Betalning', summary: 'Beställning',
    payWithCard: 'Betala nu',
    paidReceived: 'Betalning mottagen!',
    adminVerify: 'Admin verifierar',
    telegramContact: 'Kontakta @tenza_me på Telegram',
    telegramFooter: 'Kontakta via Telegram',
    cartEmpty: 'Varukorgen är tom', continueShopping: 'Fortsätt handla',
    required: 'Obligatoriskt', invalidEmail: 'Ogiltig e-post',
    invalidPhone: 'Ogiltig telefon',
    deliveryFree: 'Gratis', orderAmount: 'Totalt',
    yourOrder: 'Din beställning', security: 'Betalningar är krypterade',
    welcomeBack: 'Välkommen tillbaka', autoFilled: 'Uppgifter ifyllda automatiskt',
    totalPay: 'Totalt att betala', chooseMethod: 'Välj betalningsmetod',
    items: 'produkter',
  },
}

export default function CheckoutPage() {
  const { locale } = useI18n()
  const { user, addPurchaseBonus } = useAuth()
  const ll = L[locale] || L.en

  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    country: 'fi', city: '', address: '', postalCode: '',
    floor: '', doorCode: '', delivery: 'standard',
  })

  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState(null)
  const [pendingOrderRef, setPendingOrderRef] = useState(null)
  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    const cart = getCart()
    setCartItems(cart)
    const profile = autoFillUserProfile()
    if (profile.customerName || profile.customerEmail) {
      setForm(f => ({ ...f, ...profile }))
      setAutoFilled(true)
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCost = form.delivery === 'express' ? 10 : 0
  const orderTotal = subtotal + deliveryCost
  const isFinland = form.country === 'fi'
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

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
    if (submitting || pendingOrderId) return
    setSubmitting(true)

    const orderId = generateOrderId()
    const order = {
      id: orderId, orderId,
      customerName: form.customerName, fullName: form.customerName,
      email: form.customerEmail, phone: form.customerPhone,
      country: form.country, city: form.city, address: form.address,
      postalCode: form.postalCode, floor: form.floor, doorCode: form.doorCode,
      items: cartItems, subtotal, delivery: form.delivery, deliveryCost,
      total: orderTotal, paymentMethod: 'card',
      coinsUsed: 0, coinsEarned: 0,
      remainingAmount: orderTotal,
      login: user?.login || form.customerEmail,
      status: 'pending_payment',
      history: [{ status: 'pending_payment', time: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    }
    setPendingOrderId(orderId)
    setPendingOrderRef(order)
    await addOrder(order)
    fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {})
    sendTelegramNotification(order)
    setSubmitting(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
            <ShoppingBag size={32} className="text-gray-500" />
          </div>
          <p className="text-white text-xl font-bold mb-2">{ll.cartEmpty}</p>
          <p className="text-gray-500 text-sm mb-6">¯\_(ツ)_/¯</p>
          <Link href="/" className="px-8 py-3.5 bg-[#ccff00] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all">
            {ll.continueShopping}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/cart" className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all">
            <ArrowLeft size={18} className="text-gray-400" />
          </Link>
          <h1 className="font-semibold text-sm tracking-wide">{ll.title}</h1>
          <div className="flex items-center gap-1.5">
            {[1, 2].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#ccff00]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10 pt-4">
          {[
            { num: 1, label: ll.customerInfo },
            { num: 2, label: ll.paymentMethod },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                step >= s.num ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-600'
              }`}>
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  step >= s.num ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-500'
                }`}>{s.num}</span>
                {s.label}
              </div>
              {s.num < 2 && <ChevronRight size={14} className="text-gray-700" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto space-y-5">
              {autoFilled && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/[0.04] border border-green-500/15 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{ll.welcomeBack}, {form.customerName}!</p>
                    <p className="text-gray-500 text-xs mt-0.5">{ll.autoFilled}</p>
                  </div>
                </motion.div>
              )}

              {/* Customer info */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                    <User size={15} className="text-[#ccff00]" />
                  </div>
                  <span className="text-sm font-semibold">{ll.customerInfo}</span>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-3.5">
                    {[
                      { key: 'customerName', label: ll.fullName, type: 'text' },
                      { key: 'customerEmail', label: ll.email, type: 'email' },
                      { key: 'customerPhone', label: ll.phone, type: 'tel' },
                      { key: 'country', label: ll.country, type: 'select',
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
                        <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{f.label}</label>
                        {f.type === 'select' ? (
                          <select value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all">
                            {f.options.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a0a]">{o.label}</option>)}
                          </select>
                        ) : (
                          <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                            className={`w-full bg-white/[0.04] border ${errors[f.key] ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all`} />
                        )}
                        {errors[f.key] && <p className="text-red-400 text-[11px] mt-1.5">{errors[f.key]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                    <MapPin size={15} className="text-[#ccff00]" />
                  </div>
                  <span className="text-sm font-semibold">{ll.deliveryAddr}</span>
                </div>
                <div className="p-6">
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{ll.address}</label>
                      <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                        className={`w-full bg-white/[0.04] border ${errors.address ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all`} />
                      {errors.address && <p className="text-red-400 text-[11px] mt-1.5">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                      <div>
                        <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{ll.city}</label>
                        <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                          className={`w-full bg-white/[0.04] border ${errors.city ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all`} />
                        {errors.city && <p className="text-red-400 text-[11px] mt-1.5">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{ll.postalCode}</label>
                        <input value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})}
                          className={`w-full bg-white/[0.04] border ${errors.postalCode ? 'border-red-500/50' : 'border-white/[0.08]'} rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all`} />
                        {errors.postalCode && <p className="text-red-400 text-[11px] mt-1.5">{errors.postalCode}</p>}
                      </div>
                      {isFinland && (
                        <>
                          <div>
                            <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{ll.floor}</label>
                            <input value={form.floor} onChange={e => setForm({...form, floor: e.target.value})}
                              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all" />
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 block">{ll.doorCode}</label>
                            <input value={form.doorCode} onChange={e => setForm({...form, doorCode: e.target.value})}
                              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 h-11 text-white text-sm outline-none focus:border-[#ccff00]/40 transition-all" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                    <Truck size={15} className="text-[#ccff00]" />
                  </div>
                  <span className="text-sm font-semibold">{ll.delivery}</span>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { id: 'standard', icon: '🚚', label: ll.standard, eta: ll.standardEta, price: 0 },
                    { id: 'express', icon: '✈️', label: ll.express, eta: ll.expressEta, price: 10 },
                  ].map(d => (
                    <label key={d.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      form.delivery === d.id
                        ? 'border-[#ccff00]/30 bg-[#ccff00]/[0.03]'
                        : 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01]'
                    }`}>
                      <input type="radio" name="delivery" checked={form.delivery === d.id} onChange={() => setForm({...form, delivery: d.id})} className="hidden" />
                      <span className="text-xl">{d.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{d.label}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{d.eta}</p>
                      </div>
                      <span className={`text-sm font-semibold ${d.price === 0 ? 'text-green-400' : 'text-[#ccff00]'}`}>
                        {d.price === 0 ? ll.deliveryFree : `$${d.price}`}
                      </span>
                    </label>
                  ))}
                  {!['fi', 'se'].includes(form.country) && (
                    <div className="bg-yellow-500/[0.04] border border-yellow-500/15 rounded-xl p-3.5 flex items-start gap-2.5">
                      <AlertCircle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-200/80 text-xs leading-relaxed">{ll.telegramContact}</p>
                    </div>
                  )}
                </div>
              </div>

              {!['fi', 'se'].includes(form.country) && (
                <div className="bg-yellow-500/[0.03] border border-yellow-500/10 rounded-2xl p-4 text-center">
                  <p className="text-yellow-200/60 text-xs font-medium">📨 {ll.telegramFooter}</p>
                </div>
              )}

              <button onClick={() => { if (validateStep1()) setStep(2) }}
                className="w-full h-12 bg-[#ccff00] text-black font-semibold rounded-xl text-sm hover:shadow-[0_0_30px_rgba(204,255,0,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group">
                {ll.continue}
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-5 gap-5">
              {/* Left column - Order Summary */}
              <div className="md:col-span-2 space-y-5">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm overflow-hidden sticky top-24">
                  <div className="px-5 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                        <Package size={15} className="text-[#ccff00]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{ll.yourOrder}</p>
                        <p className="text-gray-600 text-[11px] mt-0.5">{itemCount} {ll.items}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-2.5 mb-4 max-h-44 overflow-y-auto pr-1">
                      {cartItems.map(item => (
                        <div key={item.id || item._id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-[10px] text-gray-500 font-medium">
                            {item.quantity}x
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs truncate">
                              {typeof item.name === 'string' ? item.name : item.name?.[locale] || item.name?.en}
                            </p>
                            <p className="text-gray-600 text-[11px] mt-0.5">${item.price.toFixed(2)} each</p>
                          </div>
                          <p className="text-white text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{ll.delivery}</span>
                        <span className="text-white">{deliveryCost > 0 ? `$${deliveryCost.toFixed(2)}` : ll.deliveryFree}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-white/[0.06]">
                        <span>{ll.totalPay}</span>
                        <span className="text-[#ccff00]">${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Payment */}
              <div className="md:col-span-3 space-y-5">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                      <CreditCard size={15} className="text-[#ccff00]" />
                    </div>
                    <span className="text-sm font-semibold">{ll.paymentMethod}</span>
                  </div>
                  <div className="p-6">
                    {paymentCompleted ? (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/[0.04] border border-green-500/15 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                          <Check size={28} className="text-green-400" />
                        </div>
                        <p className="text-white font-bold text-lg">{ll.paidReceived}</p>
                        <p className="text-gray-500 text-sm mt-1">{ll.adminVerify}</p>
                      </motion.div>
                    ) : pendingOrderId ? (
                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{ll.totalPay}</p>
                            <p className="text-gray-600 text-[11px] mt-0.5">{itemCount} {ll.items}</p>
                          </div>
                          <span className="text-[#ccff00] text-xl font-bold">${orderTotal.toFixed(2)}</span>
                        </div>
                        <PaymentSelector
                          amount={orderTotal}
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
                            window.location.href = `/success?order=${pendingOrderId}&email=${encodeURIComponent(form.customerEmail)}&status=paid`
                          }}
                          onError={(msg) => console.error('Payment error:', msg)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{ll.totalPay}</p>
                            <p className="text-gray-600 text-[11px] mt-0.5">{itemCount} {ll.items}</p>
                          </div>
                          <span className="text-[#ccff00] text-xl font-bold">${orderTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-500 text-xs">{ll.chooseMethod}</p>
                        <button onClick={handlePlaceOrder} disabled={submitting}
                          className="w-full h-12 bg-[#ccff00] text-black font-semibold rounded-xl text-sm hover:shadow-[0_0_30px_rgba(204,255,0,0.2)] transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2.5">
                          {submitting ? (
                            <span className="flex items-center gap-2.5">
                              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              ...
                            </span>
                          ) : (
                            <><CreditCard size={17} /> {ll.payWithCard}</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security notice */}
                <div className="flex items-center justify-center gap-2 text-gray-600 text-[11px]">
                  <Lock size={12} />
                  <span>{ll.security}</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 h-11 border border-white/[0.08] text-gray-400 font-medium rounded-xl hover:bg-white/[0.03] hover:text-white transition-all text-sm">
                    &larr; {ll.back}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
