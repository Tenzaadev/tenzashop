'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Gift, TrendingUp, History } from 'lucide-react'
import { useLoyalty } from '@/hooks/useLoyalty'
import { useI18n } from '@/i18n'
import Header from '../components/Header'

export default function LoyaltyPage() {
  const { t } = useI18n()
  const { coins, history, useCoinsForDiscount, getDiscountValue, loaded } = useLoyalty()

  const useDiscount = () => {
    const discount = useCoinsForDiscount(coins)
    if (discount > 0) {
      alert(`${discount}$ ${t('discount_applied')}`)
    }
  }

  const howToEarn = [
    { coins: 10, desc: t('per_dollar') },
    { coins: 25, desc: t('write_review') },
    { coins: 50, desc: t('continue_shopping') },
  ]

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-4">
              <Coins size={16} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">{t('coins')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t('loyalty')} <span className="text-yellow-400">{t('program')}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {t('loyalty_desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">{t('your_coins')}</p>
                <p className="text-5xl font-black text-yellow-400">{coins}</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Coins size={40} className="text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-400">
                <span className="text-white font-bold">{getDiscountValue()}$</span> {t('discount_info').split(' = ')[1]}
              </div>
              <button
                onClick={useDiscount}
                disabled={coins < 100}
                className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Gift size={18} />
                {t('apply_discount')}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#ccff00]" />
                {t('how_it_works')}
              </h2>
              <div className="space-y-3">
                {howToEarn.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                    <span className="text-gray-400">{item.desc}</span>
                    <span className="text-yellow-400 font-bold">+{item.coins}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <History size={20} className="text-[#ccff00]" />
                {t('history')}
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">{t('no_history')}</p>
                ) : (
                  history.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b border-white/5">
                      <div>
                        <p className="text-white text-sm">{item.reason}</p>
                        <p className="text-gray-500 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <span className={item.type === 'earned' ? 'text-green-400' : 'text-red-400'}>
                        {item.type === 'earned' ? '+' : '-'}{item.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm">
              {t('how_it_works')}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}