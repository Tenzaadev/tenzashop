'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { StockIndicator } from './StockIndicator'

export default function ProductCard({ product }) {
  const { t, formatPrice, locale } = useI18n()
  const { addToCart, setCartOpen } = useCart()
  const { isWishlisted, toggleWishlist, loaded } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const liked = loaded && isWishlisted(product.id)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 8, y: x * 8 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  const fallbackImage = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#1a1a1a"/>
      <text x="200" y="250" text-anchor="middle" fill="#ccff00" font-size="60" font-weight="bold" font-family="sans-serif">TENZA</text>
    </svg>
  `)
  const name = typeof product.name === 'string' ? product.name : product.name?.[locale] || product.name?.en || ''

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#ccff00]/30 transition-colors duration-500"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id) }}
        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all border border-white/10 hover:border-white/30"
      >
        <Heart size={17} className={`transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
      </button>

      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="px-2.5 py-1 bg-[#ccff00] text-black text-[10px] font-black rounded-full uppercase tracking-wider">
            {t('new') || 'NEW'}
          </span>
        )}
        {product.isLimited && (
          <span className="px-2.5 py-1 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-wider">
            {t('limited')}
          </span>
        )}
        {product.oldPrice && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-black rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          <Image
            src={imgError ? fallbackImage : product.image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="p-4 space-y-1.5">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">TENZA</p>
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#ccff00] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span suppressHydrationWarning className="text-[#ccff00] font-bold text-base">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span suppressHydrationWarning className="text-gray-500 text-xs line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          {product.stock !== undefined && <StockIndicator stock={product.stock} locale={locale} />}
        </div>
      </Link>

      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToCart({ ...product, size: 'M', color: product.colors?.[0] || '#000' })
            if (setCartOpen) {
              setCartOpen(true)
            }
          }}
          className="w-full py-2.5 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart size={14} className="group-hover/btn:text-black transition-colors" />
          {t('add_to_cart')}
        </motion.button>
      </div>
    </motion.div>
  )
}