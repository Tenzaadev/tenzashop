'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from './ProductCard'
import { getProducts, getProductsByCategory } from '@/data/productStore'
import { useI18n } from '@/i18n'
import { X } from 'lucide-react'

export default function ProductGrid({ category = null }) {
  const { t } = useI18n()
  const router = useRouter()
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const load = () => {
      if (category && category !== 'all') {
        setFilteredProducts(getProductsByCategory(category))
      } else {
        setFilteredProducts(getProducts())
      }
    }
    load()
    window.addEventListener('products-updated', load)
    return () => window.removeEventListener('products-updated', load)
  }, [category])

  const handleClearFilter = () => {
    router.push('/')
  }

  return (
    <section id="products" className="pt-8 pb-16 px-4 max-w-7xl mx-auto">
      {category && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">
            {t(category)}
          </h2>
          <button onClick={handleClearFilter} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <X size={18} />
            <span className="text-sm">{t('clear')}</span>
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}