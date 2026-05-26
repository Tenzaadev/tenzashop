'use client'
import { motion } from 'framer-motion'
import { Clock, Package, Truck, ArrowRight, Coins } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/i18n'
import Header from '../../components/Header'

export default function SuccessPage() {
  const { t, locale } = useI18n()

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-yellow-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h1 className="text-3xl font-black text-white mb-2">{t('thank_you')}</h1>
            <p className="text-gray-400 mb-8">
              {"Buyurtmangiz qabul qilindi. Admin to'lovni tasdiqlashi bilan jo'natiladi."}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <Package size={20} className="text-[#ccff00]" />
              <div>
                <p className="text-white font-medium">{t('order_placed')}</p>
                <p className="text-gray-500 text-sm">{t('processing')}</p>
              </div>
            </div>
            <hr className="border-white/5" />
            <div className="flex items-center gap-3 text-left">
              <Truck size={20} className="text-[#ccff00]" />
              <div>
                <p className="text-white font-medium">{t('standard_shipping')}</p>
                <p className="text-gray-500 text-sm">{t('free_shipping')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-[#ccff00]/10 to-green-500/10 border-2 border-[#ccff00]/30 rounded-2xl p-6 text-center mb-8">
            <Coins size={40} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm mt-2">
              {t('coins_pending_approval') || "Admin to'lovni tasdiqlagandan so'ng hisobingizga qo'shiladi"}
            </p>
          </motion.div>

          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#ccff00] text-black font-bold rounded-full hover:bg-white transition-all">
            {t('back_to_shop')} <ArrowRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  )
}