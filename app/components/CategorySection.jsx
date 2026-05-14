'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useI18n } from '@/i18n'
import { categories } from '@/data/categories'
import { useRouter } from 'next/navigation'
import { Shirt, Footprints, Gem, Scissors, Sun, Watch, ShoppingBag, Cloud } from 'lucide-react'

const categoryData = {
  hoodie: {
    icon: Shirt,
    gradient: 'from-violet-600/30 via-violet-900/20 to-black',
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/20',
    accent: '#a855f7'
  },
  tshirt: {
    icon: Scissors,
    gradient: 'from-blue-600/30 via-blue-900/20 to-black',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    accent: '#3b82f6'
  },
  pants: {
    icon: Watch,
    gradient: 'from-indigo-600/30 via-indigo-900/20 to-black',
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/20',
    accent: '#6366f1'
  },
  shorts: {
    icon: Sun,
    gradient: 'from-cyan-600/30 via-cyan-900/20 to-black',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    accent: '#06b6d4'
  },
  jacket: {
    icon: Shirt,
    gradient: 'from-red-600/30 via-red-900/20 to-black',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    accent: '#ef4444'
  },
  windbreaker: {
    icon: Cloud,
    gradient: 'from-sky-600/30 via-sky-900/20 to-black',
    bg: 'bg-sky-500/5',
    border: 'border-sky-500/20',
    accent: '#0ea5e9'
  },
  sneakers: {
    icon: Footprints,
    gradient: 'from-orange-600/30 via-orange-900/20 to-black',
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    accent: '#f97316'
  },
  accessories: {
    icon: ShoppingBag,
    gradient: 'from-amber-600/30 via-amber-900/20 to-black',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    accent: '#f59e0b'
  },
  limited: {
    icon: Gem,
    gradient: 'from-[#ccff00]/30 via-[#ccff00]/10 to-black',
    bg: 'bg-[#ccff00]/5',
    border: 'border-[#ccff00]/30',
    accent: '#ccff00'
  },
}

export default function CategorySection() {
  const { t } = useI18n()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const router = useRouter()

  const handleCategoryClick = (slug) => {
    router.push(`/?category=${slug}`)
  }

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight"
        >
          {t('categories')}
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat, i) => {
            const style = categoryData[cat.id] || categoryData.tshirt
            const Icon = style.icon
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
              >
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`group relative flex flex-col items-center justify-center aspect-square rounded-2xl ${style.bg} ${style.border} border overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-white/30 cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 p-4 rounded-2xl mb-3 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${style.accent}15` }}>
                    <Icon size={28} style={{ color: style.accent }} className="transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  </div>

                  <span className="relative z-10 text-white font-bold text-xs md:text-sm group-hover:text-[#ccff00] transition-colors text-center px-2">
                    {t(cat.nameKey)}
                  </span>

                  <div className="absolute bottom-3 w-8 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all" style={{ backgroundColor: style.accent }} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}