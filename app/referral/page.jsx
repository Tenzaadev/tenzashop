'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gift, Copy, Users, Coins, Share2, Check, Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/i18n'
import { getReferralLink, getReferralHistory, getCoinsFromStorage } from '@/utils/referral'
import { COIN_USD_VALUE } from '@/utils/coins'
import Header from '../components/Header'

const L = {
  uz: {
    title: "Referal dasturi", desc: "Do'stingizni taklif qiling va har biringizga 25 coin!",
    yourLink: "Sizning linkingiz", linkDesc: "Bu link orqali do'stlaringizni taklif qiling",
    copy: "Nusxalash", copied: "Nusxalandi!", share: "Ulashish",
    coins: "Coin'lar", friends: "Do'stlar", perEach: "Har biriga",
    howWorks: "Qanday ishlaydi?",
    step1: "Linkni ulashing", step1Desc: "Do'stingizga referal linkingizni yuboring",
    step2: "Do'stingiz ro'yxatdan o'tsin", step2Desc: "Sizning linkingiz orqali ro'yxatdan o'tishi kerak",
    step3: "Coin'larni oling!", step3Desc: "Sizga 25 coin, do'stingizga 25 coin beriladi",
    history: "Referal tarixi", noHistory: "Hali referallar yo'q",
    loginRequired: "Iltimos, avval tizimga kiring", loginBtn: "Kirish",
    code: "Kodingiz", shareText: "TENZA SHOP'da ro'yxatdan o'ting va 25 coin bepul oling!",
  },
  ru: {
    title: "Реферальная программа", desc: "Пригласите друга и получите по 25 монет!",
    yourLink: "Ваша ссылка", linkDesc: "Приглашайте друзей по этой ссылке",
    copy: "Копировать", copied: "Скопировано!", share: "Поделиться",
    coins: "Монеты", friends: "Друзья", perEach: "Каждому",
    howWorks: "Как это работает?",
    step1: "Поделитесь ссылкой", step1Desc: "Отправьте другу вашу реферальную ссылку",
    step2: "Друг регистрируется", step2Desc: "Он должен зарегистрироваться по вашей ссылке",
    step3: "Получите монеты!", step3Desc: "Вам 25 монет, другу 25 монет",
    history: "История рефералов", noHistory: "Пока нет рефералов",
    loginRequired: "Пожалуйста, войдите в систему", loginBtn: "Войти",
    code: "Код", shareText: "Зарегистрируйтесь в TENZA SHOP и получите 25 монет бесплатно!",
  },
  en: {
    title: "Referral Program", desc: "Invite a friend and get 25 coins each!",
    yourLink: "Your link", linkDesc: "Invite friends with this link",
    copy: "Copy", copied: "Copied!", share: "Share",
    coins: "Coins", friends: "Friends", perEach: "Each",
    howWorks: "How it works?",
    step1: "Share the link", step1Desc: "Send your referral link to a friend",
    step2: "Friend registers", step2Desc: "They must register using your link",
    step3: "Get coins!", step3Desc: "You get 25 coins, friend gets 25 coins",
    history: "Referral History", noHistory: "No referrals yet",
    loginRequired: "Please log in first", loginBtn: "Login",
    code: "Code", shareText: "Sign up at TENZA SHOP and get 25 coins free!",
  },
  fi: {
    title: "Kutsuntaohjelma", desc: "Kutsu kaveri ja saatte 25 kolikkoa kumpikin!",
    yourLink: "Linkkisi", linkDesc: "Kutsu ystäviä tällä linkillä",
    copy: "Kopioi", copied: "Kopioitu!", share: "Jaa",
    coins: "Kolikot", friends: "Ystävät", perEach: "Kumpikin",
    howWorks: "Miten se toimii?",
    step1: "Jaa linkki", step1Desc: "Lähetä kutsulinkkisi ystävälle",
    step2: "Ystävä rekisteröityy", step2Desc: "Heidän täytyy rekisteröityä linkkisi kautta",
    step3: "Hanki kolikoita!", step3Desc: "Saat 25 kolikkoa, ystävä saa 25 kolikkoa",
    history: "Kutsuhistoria", noHistory: "Ei kutsuja vielä",
    loginRequired: "Kirjaudu ensin sisään", loginBtn: "Kirjaudu",
    code: "Koodi", shareText: "Rekisteröidy TENZA SHOPiin ja saat 25 kolikkoa ilmaiseksi!",
  },
  sv: {
    title: "Referensprogram", desc: "Bjud in en vän och få 25 mynt var!",
    yourLink: "Din länk", linkDesc: "Bjud in vänner med denna länk",
    copy: "Kopiera", copied: "Kopierad!", share: "Dela",
    coins: "Mynt", friends: "Vänner", perEach: "Varje",
    howWorks: "Hur fungerar det?",
    step1: "Dela länken", step1Desc: "Skicka din referenslänk till en vän",
    step2: "Vän registrerar sig", step2Desc: "De måste registrera sig via din länk",
    step3: "Få mynt!", step3Desc: "Du får 25 mynt, vän får 25 mynt",
    history: "Referenshistorik", noHistory: "Inga referenser än",
    loginRequired: "Vänligen logga in först", loginBtn: "Logga in",
    code: "Kod", shareText: "Registrera dig på TENZA SHOP och få 25 mynt gratis!",
  },
}

export default function ReferralPage() {
  const { locale } = useI18n()
  const { user } = useAuth()
  const lang = L[locale] || L.uz
  const [copied, setCopied] = useState(false)
  const [referralHistory, setReferralHistory] = useState([])
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    setCoins(getCoinsFromStorage())
    const history = getReferralHistory()
    if (user) {
      const filtered = history.filter(h => h.referrer === user.login)
      setReferralHistory(filtered.reverse())
    }
  }, [user])

  const referralLink = user ? getReferralLink(user.referralCode) : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TENZA SHOP',
          text: lang.shareText,
          url: referralLink,
        })
      } catch {}
    } else {
      handleCopy()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl mb-4">{lang.loginRequired}</p>
            <Link href="/login" className="px-8 py-3 bg-[#ccff00] text-black font-bold rounded-xl inline-block">
              {lang.loginBtn}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> {lang.title}
          </Link>

          <div className="text-center mb-8">
            <Gift className="w-16 h-16 text-[#ccff00] mx-auto mb-4" />
            <h1 className="text-3xl font-black mb-2">{lang.title}</h1>
            <p className="text-gray-400">{lang.desc}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Coins, value: coins, label: lang.coins, color: 'text-yellow-400' },
              { icon: Users, value: user.referralCount || 0, label: lang.friends, color: 'text-[#ccff00]' },
              { icon: Gift, value: '+25', label: lang.perEach, color: 'text-green-400' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-[#ccff00]/10 to-green-500/10 border border-[#ccff00]/30 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg mb-1">{lang.yourLink}</h3>
            <p className="text-gray-400 text-sm mb-3">{lang.linkDesc}</p>

            <div className="bg-black/50 rounded-xl p-3 mb-3">
              <code className="text-[#ccff00] text-sm break-all">{referralLink}</code>
            </div>

            <div className="flex gap-2">
              <button onClick={handleCopy}
                className="flex-1 py-3 bg-[#ccff00] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all">
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? lang.copied : lang.copy}
              </button>
              <button onClick={handleShare}
                className="py-3 px-5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">{lang.howWorks}</h3>
            <div className="space-y-4">
              {[
                { num: 1, title: lang.step1, desc: lang.step1Desc },
                { num: 2, title: lang.step2, desc: lang.step2Desc },
                { num: 3, title: lang.step3, desc: lang.step3Desc },
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-8 h-8 bg-[#ccff00]/20 text-[#ccff00] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {referralHistory.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">{lang.history}</h3>
              <div className="space-y-2">
                {referralHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Gift size={16} className="text-[#ccff00]" />
                      <span className="text-white">{h.newUser}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-sm">+{h.coinsAwarded} coin</span>
                      <span className="text-gray-600 text-[10px]">${(h.coinsAwarded * COIN_USD_VALUE).toFixed(2)}</span>
                      <span className="text-gray-500 text-xs">{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
