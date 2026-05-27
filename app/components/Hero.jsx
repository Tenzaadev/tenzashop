'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useI18n } from '@/i18n'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_80%)] z-[1] pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
        >
          <h1 className="relative text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-6 select-none">
            <span className="relative text-white">
              TENZA
              <span className="absolute inset-0 text-[#ccff00] animate-pulse opacity-70" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 65%)', left: '-3px' }}>
                TENZA
              </span>
              <span className="absolute inset-0 text-red-500 animate-pulse opacity-50" style={{ clipPath: 'polygon(0 65%, 100% 35%, 100% 100%, 0 100%)', left: '3px' }}>
                TENZA
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#products"
            className="px-8 py-4 bg-[#ccff00] text-black font-bold rounded-full text-lg hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-shadow"
          >
            {t('view_collection')}
          </motion.a>

        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-[#ccff00] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}