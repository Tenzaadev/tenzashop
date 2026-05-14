'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shirt, Palette, RefreshCw } from 'lucide-react'
import { products } from '@/data/products'
import { useI18n } from '@/i18n'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

const styles = ['Sport', 'Klassik', 'Minimal', 'Futuristik', "Ko'cha", 'Yoshlik']
const colorOptions = ['Qora', 'Oq', 'Yashil', "Ko'k", 'Qizil', 'Kulrang', 'Binafsha']
const occasions = ['Har kungi', 'Bayram', 'Sport zal', 'Uchrashuv', 'Kechki']

export default function AIStylistPage() {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    style: '',
    colors: [],
    occasion: '',
    age: '',
    budget: '',
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleColor = (color) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const getRecommendations = () => {
    setLoading(true)
    setTimeout(() => {
      let filtered = [...products]

      if (preferences.style === 'Futuristik') {
        filtered = products.filter(p => p.category === 'limited' || p.isLimited)
      } else if (preferences.style === 'Sport') {
        filtered = products.filter(p => ['tshirt', 'shorts', 'sneakers'].includes(p.category))
      } else if (preferences.style === "Ko'cha") {
        filtered = products.filter(p => ['hoodie', 'sneakers', 'accessories'].includes(p.category))
      } else if (preferences.style === 'Minimal') {
        filtered = products.filter(p => ['tshirt', 'hoodie'].includes(p.category))
      }

      if (preferences.budget && preferences.budget !== '999') {
        filtered = filtered.filter(p => p.price <= parseInt(preferences.budget))
      }

      filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 6)
      setRecommendations(filtered)
      setLoading(false)
      setStep(4)
    }, 2000)
  }

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full mb-4">
              <Sparkles size={16} className="text-[#ccff00]" />
              <span className="text-[#ccff00] text-sm font-medium">{t('ai_stylist')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t('about_title').split(' - ')[0]} <span className="text-[#ccff00]">{t('style_ready').split(' ')[0]}</span> {t('hero_subtitle').split(' ')[0]}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('ai_stylist_desc') || 'AI sizning tafyingizga qarab eng mos kiyimlarni tanlaydi'}
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-12 h-1.5 rounded-full transition-all ${step >= s ? 'bg-[#ccff00]' : 'bg-white/10'}`} />
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">{t('what_style')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {styles.map(style => (
                  <button
                    key={style}
                    onClick={() => { setPreferences(prev => ({ ...prev, style })); setStep(2) }}
                    className={`p-6 rounded-2xl border-2 transition-all text-center ${
                      preferences.style === style
                        ? 'border-[#ccff00] bg-[#ccff00]/5'
                        : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                    }`}
                  >
                    <Shirt size={28} className="mx-auto mb-2 text-[#ccff00]" />
                    <span className="text-white font-bold">{style}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">{t('back')}</button>
                <h2 className="text-2xl font-bold text-white">{t('favorite_colors')}</h2>
                <button onClick={() => setStep(3)} className="text-[#ccff00] font-medium">{t('next')} →</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      preferences.colors.includes(color)
                        ? 'border-[#ccff00] bg-[#ccff00]/5'
                        : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                    }`}
                  >
                    <Palette size={24} className="mx-auto mb-2 text-[#ccff00]" />
                    <span className="text-white font-bold text-sm">{color}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white">{t('back')}</button>
                <h2 className="text-2xl font-bold text-white">{t('additional')}</h2>
                <div />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('your_age')}</label>
                  <input
                    type="number"
                    value={preferences.age}
                    onChange={e => setPreferences(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="20"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('budget')}</label>
                  <select
                    value={preferences.budget}
                    onChange={e => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ccff00]/50"
                  >
                    <option value="" className="bg-[#111]">{t('select_budget')}</option>
                    <option value="50" className="bg-[#111]">$50</option>
                    <option value="100" className="bg-[#111]">$50-$100</option>
                    <option value="200" className="bg-[#111]">$100-$200</option>
                    <option value="999" className="bg-[#111]">$200+</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">{t('purpose')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {occasions.map(occ => (
                      <button
                        key={occ}
                        onClick={() => setPreferences(prev => ({ ...prev, occasion: occ }))}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          preferences.occasion === occ
                            ? 'border-[#ccff00] bg-[#ccff00]/5 text-white'
                            : 'border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={getRecommendations}
                  className="w-full py-4 bg-[#ccff00] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  {t('get_recommendations')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {loading ? (
                <div className="text-center py-20">
                  <RefreshCw size={40} className="text-[#ccff00] animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">{t('loading_style')}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">
                      {t('get_recommendations').split(' ')[0]} <span className="text-[#ccff00]">{recommendations.length}</span>
                    </h2>
                    <button
                      onClick={() => { setStep(1); setRecommendations([]) }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <RefreshCw size={16} /> {t('try_again')}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {recommendations.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}