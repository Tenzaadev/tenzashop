'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, User, Save, Check, Copy, Gift, Coins, Users, LogOut, Share2, Clock, ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'
import { getReferralLink, getReferralHistory, getCoinsFromStorage } from '@/utils/referral'
import { COIN_USD_VALUE } from '@/utils/coins'
import { getOrders } from '@/data/orders'

const L = {
  uz: { title: "Profil", name: "Ism", email: "Email", phone: "Telefon", address: "Manzil", save: "Saqlash", saved: "Saqlanildi!", personalInfo: "Shaxsiy ma'lumotlar", referralTitle: "Referal dasturi", referralDesc: "Do'stlaringizni taklif qiling va coin yig'ing!", yourCode: "Kodingiz", copy: "Nusxalash", copied: "Nusxalandi!", coins: "Coin", referrals: "Takliflar", referralLink: "Referal havola", viewAll: "Barchasini ko'rish", invited: "Taklif qilindi", by: "Taklif qildi", logout: "Chiqish", back: "Orqaga", coinHistory: "Coin tarixi", noHistory: "Hali coin harakati yo'q", coinUsed: "Buyurtmada ishlatildi", coinEarned: "Buyurtma bonusi", coinReferred: "Referal bonusi" },
  ru: { title: "Профиль", name: "Имя", email: "Email", phone: "Телефон", address: "Адрес", save: "Сохранить", saved: "Сохранено!", personalInfo: "Личные данные", referralTitle: "Реферальная программа", referralDesc: "Приглашайте друзей и зарабатывайте монеты!", yourCode: "Ваш код", copy: "Копировать", copied: "Скопировано!", coins: "Монет", referrals: "Рефералов", referralLink: "Реферальная ссылка", viewAll: "Посмотреть все", invited: "Приглашён", by: "Пригласил", logout: "Выйти", back: "Назад", coinHistory: "История монет", noHistory: "История пуста", coinUsed: "Использовано в заказе", coinEarned: "Бонус за заказ", coinReferred: "Реферальный бонус" },
  en: { title: "Profile", name: "Name", email: "Email", phone: "Phone", address: "Address", save: "Save", saved: "Saved!", personalInfo: "Personal Info", referralTitle: "Referral Program", referralDesc: "Invite friends and earn coins!", yourCode: "Your code", copy: "Copy", copied: "Copied!", coins: "Coins", referrals: "Referrals", referralLink: "Referral link", viewAll: "View all", invited: "Invited", by: "Invited by", logout: "Logout", back: "Back", coinHistory: "Coin History", noHistory: "No coin activity yet", coinUsed: "Used in order", coinEarned: "Order reward", coinReferred: "Referral bonus" },
  fi: { title: "Profiili", name: "Nimi", email: "Sähköposti", phone: "Puhelin", address: "Osoite", save: "Tallenna", saved: "Tallennettu!", personalInfo: "Henkilötiedot", referralTitle: "Kutsuntaohjelma", referralDesc: "Kutsu ystäviä ja ansaitse kolikoita!", yourCode: "Koodisi", copy: "Kopioi", copied: "Kopioitu!", coins: "Kolikot", referrals: "Kutsut", referralLink: "Kutsulinkki", viewAll: "Katso kaikki", invited: "Kutsuttu", by: "Kutsuja", logout: "Kirjaudu ulos", back: "Takaisin", coinHistory: "Kolikkohistoria", noHistory: "Ei kolikkoaktiviteettia", coinUsed: "Käytetty tilauksessa", coinEarned: "Tilauspalkkio", coinReferred: "Kutsupalkkio" },
  sv: { title: "Profil", name: "Namn", email: "E-post", phone: "Telefon", address: "Adress", save: "Spara", saved: "Sparad!", personalInfo: "Personlig info", referralTitle: "Referensprogram", referralDesc: "Bjud in vänner och tjäna mynt!", yourCode: "Din kod", copy: "Kopiera", copied: "Kopierad!", coins: "Mynt", referrals: "Referenser", referralLink: "Referenslänk", viewAll: "Visa alla", invited: "Inbjuden", by: "Inbjuden av", logout: "Logga ut", back: "Tillbaka", coinHistory: "Mynthistorik", noHistory: "Ingen myntaktivitet än", coinUsed: "Använt i beställning", coinEarned: "Beställningsbonus", coinReferred: "Värvningsbonus" },
}

export default function ProfilePage() {
  const { locale } = useI18n()
  const { user, logout } = useAuth()
  const lang = L[locale] || L.uz
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', address: '' })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [coins, setCoins] = useState(0)
  const [coinHistory, setCoinHistory] = useState([])

  useEffect(() => {
    if (!user) { setCoins(0); setCoinHistory([]); return }
    try {
      const saved = localStorage.getItem('tenza_user')
      if (saved) {
        setUserData(JSON.parse(saved))
      } else {
        setUserData({ name: '', email: '', phone: '', address: '' })
      }
    } catch {}
    setCoins(getCoinsFromStorage())
    const orders = getOrders().filter(o => o.email === user.login || o.login === user.login)
    const history = []
    orders.forEach(o => {
      const used = o.coinsDeducted || o.coinsUsed || 0
      if (used > 0) history.push({ date: o.paidAt || o.createdAt, amount: -used, desc: lang.coinUsed, orderId: o.orderId || o.id })
      if (o.coinsEarned > 0) history.push({ date: o.paidAt || o.createdAt, amount: o.coinsEarned, desc: lang.coinEarned, orderId: o.orderId || o.id })
    })
    const refHistory = getReferralHistory().filter(r => r.referrer === user.login)
    refHistory.forEach(r => history.push({ date: r.date, amount: r.coinsAwarded, desc: lang.coinReferred, user: r.newUser }))
    history.sort((a, b) => new Date(b.date) - new Date(a.date))
    setCoinHistory(history)
  }, [user])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('tenza_user')
    localStorage.removeItem('tenza_user_email')
    window.dispatchEvent(new Event('login'))
    window.location.href = '/'
  }

  const handleSave = () => {
    localStorage.setItem('tenza_user', JSON.stringify(userData))
    localStorage.setItem('tenza_user_email', userData.email)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(getReferralLink(user.referralCode))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyCodeText = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-lg mx-auto px-4 pt-20 pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> {lang.back}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#ccff00]/10 border-2 border-[#ccff00]/30 flex items-center justify-center mx-auto mb-4">
            {user?.login ? (
              <span className="text-2xl font-bold text-[#ccff00]">{user.login[0].toUpperCase()}</span>
            ) : (
              <User size={36} className="text-[#ccff00]" />
            )}
          </div>
          <h2 className="text-xl font-bold">{user?.login || userData.name || '—'}</h2>
          <p className="text-gray-400 text-sm">{userData.email || '—'}</p>
        </motion.div>

        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-r from-[#ccff00]/10 to-green-500/10 border border-[#ccff00]/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift size={20} className="text-[#ccff00]" />
                <h3 className="font-bold">{lang.referralTitle}</h3>
              </div>
              <Link href="/referral" className="text-xs text-[#ccff00] hover:underline">{lang.viewAll} →</Link>
            </div>
            <p className="text-gray-400 text-sm mb-4">{lang.referralDesc}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <Coins size={18} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-lg font-bold">{coins}</p>
                <p className="text-gray-500 text-xs">{lang.coins}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <Users size={18} className="text-[#ccff00] mx-auto mb-1" />
                <p className="text-lg font-bold">{user.referralCount || 0}</p>
                <p className="text-gray-500 text-xs">{lang.referrals}</p>
              </div>
            </div>

            {/* Coin History */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gray-400" />
                <p className="text-gray-400 text-xs font-medium">{lang.coinHistory}</p>
              </div>
              {coinHistory.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-3">{lang.noHistory}</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {coinHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs ${h.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {h.amount > 0 ? '+' : ''}{h.amount}
                        </span>
                        <span className="text-gray-600 text-[10px]">${(Math.abs(h.amount) * COIN_USD_VALUE).toFixed(2)}</span>
                        <span className="text-gray-400 text-xs truncate">{h.desc}</span>
                        {h.orderId && (
                          <Link href={`/tracking?order=${h.orderId}`} className="text-gray-600 hover:text-[#ccff00] flex-shrink-0">
                            <ArrowUpRight size={10} />
                          </Link>
                        )}
                      </div>
                      <span className="text-gray-600 text-[10px] flex-shrink-0 ml-2">
                        {new Date(h.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-2">{lang.referralLink}:</p>
              <div className="bg-black/50 rounded-xl p-3 mb-1">
                <code className="text-[#ccff00] text-xs break-all">{getReferralLink(user.referralCode)}</code>
              </div>
              <p className="text-gray-500 text-xs mb-2 text-center">
                {lang.yourCode}: <span className="text-white font-mono">{user.referralCode}</span>
                  <button onClick={handleCopyCodeText} className="inline-flex ml-1.5 text-gray-500 hover:text-white transition-colors align-middle">
                    {codeCopied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
              </p>
              <div className="flex gap-2">
                <button onClick={handleCopyCode}
                  className="flex-1 py-2.5 bg-[#ccff00] text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-white transition-all">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? lang.copied : lang.copy}
                </button>
                <button onClick={async () => {
                  const link = getReferralLink(user.referralCode)
                  if (navigator.share) {
                    try { await navigator.share({ title: 'TENZA SHOP', url: link }) } catch {}
                  } else {
                    navigator.clipboard.writeText(link)
                  }
                }}
                  className="px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {user.referredBy && (
              <p className="text-gray-500 text-xs mt-3">{lang.by}: <span className="text-[#ccff00]">{user.referredBy}</span></p>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="text-[#ccff00] font-bold text-sm mb-4">{lang.personalInfo}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">{lang.name}</label>
              <input value={userData.name} onChange={e => setUserData(d => ({ ...d, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">{lang.email}</label>
              <input type="email" value={userData.email} onChange={e => setUserData(d => ({ ...d, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">{lang.phone}</label>
              <input type="tel" value={userData.phone || ''} onChange={e => setUserData(d => ({ ...d, phone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">{lang.address}</label>
              <input value={userData.address || ''} onChange={e => setUserData(d => ({ ...d, address: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50" />
            </div>
          </div>
          <button onClick={handleSave}
            className="w-full mt-6 py-4 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
            {saved ? <><Check size={20} /> {lang.saved}</> : <><Save size={20} /> {lang.save}</>}
          </button>
        </motion.div>

        <button onClick={handleLogout}
          className="w-full mt-4 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
          <LogOut size={20} /> {lang.logout}
        </button>
      </div>
    </div>
  )
}
