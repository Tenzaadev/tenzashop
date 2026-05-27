'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Eye, Package } from 'lucide-react'
import { getProducts } from '@/data/productStore'
import { useHeatMap } from '@/hooks/useHeatMap'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

export default function TrendingPage() {
  const { getHotProducts, getTrendingProducts, getProductStats } = useHeatMap()
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const load = () => setAllProducts(getProducts())
    load()
    window.addEventListener('products-updated', load)
    return () => window.removeEventListener('products-updated', load)
  }, [])

  const hotIds = getHotProducts(10)
  const trendingIds = getTrendingProducts(10)

  const hotProducts = hotIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)
  const trendingProducts = trendingIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <Flame size={16} className="text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Trending</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ommabop <span className="text-orange-400">Mahsulotlar</span>
            </h1>
            <p className="text-gray-400 text-lg">
              TENZA mijozlar eng ko'p sotib olgan va ko'rilgan mahsulotlar
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Flame size={24} className="text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Eng ko'p sotilgan</h2>
              </div>
              <div className="space-y-4">
                {hotProducts.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
                    <Package size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Hali ma'lumot yo'q</p>
                  </div>
                ) : (
                  hotProducts.map((product, i) => {
                    const stats = getProductStats(product.id)
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-orange-500/20 transition-colors"
                      >
                        <span className="text-3xl font-black text-orange-400/50 w-10">#{i + 1}</span>
                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{product.name}</p>
                          <p className="text-gray-500 text-sm">{stats.purchases} ta sotilgan</p>
                        </div>
                        <span className="text-[#ccff00] font-bold text-lg">${product.price}</span>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={24} className="text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Hozir ko'rilayotgan</h2>
              </div>
              <div className="space-y-4">
                {trendingProducts.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
                    <Eye size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Hali ma'lumot yo'q</p>
                  </div>
                ) : (
                  trendingProducts.map((product, i) => {
                    const stats = getProductStats(product.id)
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{product.name}</p>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Eye size={12} />
                            {stats.views} ko'rish
                          </div>
                        </div>
                        <span className="text-[#ccff00] font-bold text-lg">${product.price}</span>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Barcha mahsulotlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}