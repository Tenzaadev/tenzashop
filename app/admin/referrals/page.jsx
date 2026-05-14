'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Users, Coins, TrendingUp } from 'lucide-react'
import { useI18n } from '@/i18n'
import { getReferralHistory } from '@/utils/referral'

const L = {
  uz: {
    title: "Referal statistikasi", totalReferrals: "Jami referallar", totalCoins: "Berilgan coin'lar",
    activeReferrers: "Faol refererlar", topReferrers: "Top refererlar", recentReferrals: "So'nggi referallar",
    referrer: "Taklif qilgan", newUser: "Yangi foydalanuvchi", coins: "Coin", date: "Sana", friend: "ta do'st",
  },
  ru: {
    title: "Реферальная статистика", totalReferrals: "Всего рефералов", totalCoins: "Выдано монет",
    activeReferrers: "Активные рефереры", topReferrers: "Топ рефереры", recentReferrals: "Последние рефералы",
    referrer: "Пригласил", newUser: "Новый пользователь", coins: "Монеты", date: "Дата", friend: "др.",
  },
  en: {
    title: "Referral Statistics", totalReferrals: "Total Referrals", totalCoins: "Coins Awarded",
    activeReferrers: "Active Referrers", topReferrers: "Top Referrers", recentReferrals: "Recent Referrals",
    referrer: "Referrer", newUser: "New User", coins: "Coins", date: "Date", friend: "friends",
  },
  fi: {
    title: "Kutsutilastot", totalReferrals: "Kutsut yhteensä", totalCoins: "Kolikoita jaettu",
    activeReferrers: "Aktiiviset kutsujat", topReferrers: "Parhaat kutsujat", recentReferrals: "Viimeisimmät kutsut",
    referrer: "Kutsuja", newUser: "Uusi käyttäjä", coins: "Kolikot", date: "Päivä", friend: "ystävää",
  },
  sv: {
    title: "Referensstatistik", totalReferrals: "Totalt referenser", totalCoins: "Mynt utdelade",
    activeReferrers: "Aktiva referensgivare", topReferrers: "Topp referensgivare", recentReferrals: "Senaste referenser",
    referrer: "Referensgivare", newUser: "Ny användare", coins: "Mynt", date: "Datum", friend: "vänner",
  },
}

export default function AdminReferralsPage() {
  const { locale } = useI18n()
  const lang = L[locale] || L.uz
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalCoinsAwarded: 0,
    topReferrers: [],
    recentReferrals: [],
  })

  useEffect(() => {
    const history = getReferralHistory()
    const totalCoins = history.reduce((sum, h) => sum + (h.coinsAwarded || 0), 0)

    const referrerCounts = {}
    history.forEach(h => {
      referrerCounts[h.referrer] = (referrerCounts[h.referrer] || 0) + 1
    })

    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([nickname, count]) => {
        let coins = 0
        try {
          const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
          const key = `tenza_user_${nickname.toLowerCase().trim()}`
          coins = users[key]?.coins || 0
        } catch {}
        return { nickname, count, coins }
      })

    setStats({
      totalReferrals: history.length,
      totalCoinsAwarded: totalCoins,
      topReferrers,
      recentReferrals: history.slice(-10).reverse(),
    })
  }, [])

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Gift className="text-[#ccff00]" /> {lang.title}
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users, value: stats.totalReferrals, label: lang.totalReferrals, color: 'text-[#ccff00]', bg: 'bg-[#ccff00]/10' },
          { icon: Coins, value: stats.totalCoinsAwarded, label: lang.totalCoins, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { icon: TrendingUp, value: stats.topReferrers.length, label: lang.activeReferrers, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`${card.bg} border border-white/5 rounded-2xl p-5`}>
            <card.icon size={24} className={`${card.color} mb-2`} />
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">{lang.topReferrers}</h3>
          <div className="space-y-3">
            {stats.topReferrers.map((ref, i) => (
              <div key={ref.nickname} className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-[#ccff00] font-bold text-lg">#{i + 1}</span>
                  <span className="text-white font-medium">{ref.nickname}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">{ref.count} {lang.friend}</span>
                  <span className="text-yellow-400 font-bold">{ref.coins} coins</span>
                </div>
              </div>
            ))}
            {stats.topReferrers.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">—</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">{lang.recentReferrals}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="py-2 pr-4">{lang.referrer}</th>
                  <th className="py-2 pr-4">{lang.newUser}</th>
                  <th className="py-2 pr-4">{lang.coins}</th>
                  <th className="py-2">{lang.date}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentReferrals.map((ref, i) => (
                  <tr key={i} className="border-t border-white/5 text-sm">
                    <td className="py-3 pr-4 text-white">{ref.referrer}</td>
                    <td className="py-3 pr-4 text-[#ccff00]">{ref.newUser}</td>
                    <td className="py-3 pr-4 text-yellow-400">+{ref.coinsAwarded}</td>
                    <td className="py-3 text-gray-400">{new Date(ref.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {stats.recentReferrals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 text-sm py-4">—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
