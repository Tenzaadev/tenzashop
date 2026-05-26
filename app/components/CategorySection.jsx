'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useI18n } from '@/i18n'
import { categories } from '@/data/categories'
import { useRouter } from 'next/navigation'

const stickers = {
  hoodie: { emoji: '🧥', gradient: 'from-violet-500/40 via-fuchsia-600/20', accent: '#a855f7', glow: '#c084fc', pattern: 'radial-gradient(circle at 20% 80%, #a855f7 0%, transparent 60%)' },
  tshirt: { emoji: '👕', gradient: 'from-blue-500/40 via-cyan-600/20', accent: '#3b82f6', glow: '#60a5fa', pattern: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 60%)' },
  pants: { emoji: '👖', gradient: 'from-indigo-500/40 via-violet-600/20', accent: '#6366f1', glow: '#818cf8', pattern: 'radial-gradient(circle at 50% 120%, #6366f1 0%, transparent 60%)' },
  shorts: { emoji: '🩳', gradient: 'from-cyan-500/40 via-teal-600/20', accent: '#06b6d4', glow: '#22d3ee', pattern: 'radial-gradient(circle at 10% 10%, #06b6d4 0%, transparent 60%)' },
  jacket: { emoji: '🧥', gradient: 'from-red-500/40 via-rose-600/20', accent: '#ef4444', glow: '#f87171', pattern: 'radial-gradient(circle at 90% 70%, #ef4444 0%, transparent 60%)' },
  windbreaker: { emoji: '🧥', gradient: 'from-sky-500/40 via-blue-600/20', accent: '#0ea5e9', glow: '#38bdf8', pattern: 'radial-gradient(circle at 30% 30%, #0ea5e9 0%, transparent 60%)' },
  sneakers: { emoji: '👟', gradient: 'from-orange-500/40 via-amber-600/20', accent: '#f97316', glow: '#fb923c', pattern: 'radial-gradient(circle at 70% 50%, #f97316 0%, transparent 60%)' },
  accessories: { emoji: '🎒', gradient: 'from-amber-500/40 via-yellow-600/20', accent: '#f59e0b', glow: '#fbbf24', pattern: 'radial-gradient(circle at 40% 90%, #f59e0b 0%, transparent 60%)' },
  limited: { emoji: '💎', gradient: 'from-[#ccff00]/40 via-lime-500/20', accent: '#ccff00', glow: '#ccff00', pattern: 'radial-gradient(circle at 60% 40%, #ccff00 0%, transparent 60%)' },
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
            const s = stickers[cat.id] || stickers.tshirt
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
              >
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-500 cursor-pointer"
                  style={{ perspective: '600px' }}
                >
                  {/* Hover 3D tilt container */}
                  <div className="absolute inset-0 transition-all duration-500 group-hover:[transform:rotateX(2deg)_rotateY(-2deg)_scale(1.02)]" />

                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />

                  {/* Pattern glow */}
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ background: s.pattern }} />

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `inset 0 0 30px ${s.glow}33, 0 0 20px ${s.glow}22` }} />

                  {/* Orb glow behind sticker */}
                  <div className="absolute w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500" style={{ background: s.glow }} />

                  {/* Sticker container */}
                  <div
                    className="relative z-10 mb-3 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                  >
                    {/* Sticker base with glassmorphism */}
                    <div
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${s.accent}25, ${s.accent}08)`,
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${s.accent}33`,
                        boxShadow: `0 8px 32px ${s.accent}22, inset 0 1px 0 ${s.accent}44`,
                      }}
                    >
                      {/* Inner glow */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${s.accent}33, transparent 60%)`,
                        }}
                      />
                      <span
                        className="relative text-3xl md:text-4xl leading-none transition-all duration-500 group-hover:scale-110"
                        style={{ filter: `drop-shadow(0 0 8px ${s.glow}66)` }}
                      >
                        {s.emoji}
                      </span>
                    </div>
                  </div>

                  {/* Category name */}
                  <span
                    className="relative z-10 text-white font-bold text-xs md:text-sm text-center px-2 transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    {t(cat.nameKey)}
                  </span>

                  {/* Accent bar */}
                  <div
                    className="absolute bottom-3 w-6 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-10"
                    style={{ background: s.accent, boxShadow: `0 0 12px ${s.glow}88` }}
                  />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}