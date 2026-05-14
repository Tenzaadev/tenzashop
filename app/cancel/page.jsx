'use client'
import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useI18n } from '@/i18n'
import Header from '../components/Header'

export default function CancelPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header onCartOpen={() => {}} />
      <main className="pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle size={48} className="text-red-500" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('payment_cancelled') || 'To\'lov bekor qilindi'}
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            {t('payment_not_completed') || 'To\'lov yakunlanmadi. Qayta urinib ko\'rishingiz mumkin.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ccff00] text-black font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all"
            >
              <RefreshCw size={20} />
              {t('try_again') || 'Qayta urinib ko\'rish'}
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={20} />
              {t('back_to_shop') || 'Do\'konga qaytish'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}