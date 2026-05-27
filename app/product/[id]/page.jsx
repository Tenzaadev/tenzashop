'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Heart, ShoppingCart, Check, Star, Truck, RotateCcw,
  Shield, Minus, Plus, Share2
} from 'lucide-react'
import { getProducts, getProductById } from '@/data/productStore'
import { useI18n } from '@/i18n'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { StockIndicator, SoldCount } from '../../components/StockIndicator'
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import ReviewCard from '@/components/ReviewCard'
import { subscribeProductReviews, addReview } from '@/lib/firestore'

export default function ProductPage() {
  const { id } = useParams()
  const { t, locale, formatPrice } = useI18n()
  const { addToCart, setCartOpen } = useCart()
  const { isWishlisted, toggleWishlist, loaded } = useWishlist()

  const [product, setProduct] = useState(null)
  const productName = (p) => (typeof p.name === 'string' ? p.name : p.name?.[locale] || p.name?.en || '')

  useEffect(() => {
    setProduct(getProductById(id))
    const h = () => setProduct(getProductById(id))
    window.addEventListener('products-updated', h)
    return () => window.removeEventListener('products-updated', h)
  }, [id])
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (!id) return
    const unsub = subscribeProductReviews(id, setReviews)
    return () => unsub()
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-6xl mb-4">😕</p>
            <p className="text-white text-2xl font-bold mb-2">{t('no_results')}</p>
            <Link href="/" className="text-[#ccff00] hover:underline">{t('home')}</Link>
          </div>
        </div>
        
      </div>
    )
  }

  const liked = loaded && isWishlisted(product?.id)
  const relatedProducts = product ? getProducts().filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : []
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const allImages = [product.image, product.hoverImage || product.image].filter(Boolean)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, size: selectedSize, color: selectedColor })
    }
    setCartOpen(true)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const submitReview = async () => {
    if (userRating === 0 || !reviewText.trim()) return
    await addReview({
      productId: id,
      userId: 'anonymous',
      userName: 'TENZA Customer',
      rating: userRating,
      comment: reviewText.trim(),
    })
    setUserRating(0)
    setReviewText('')
  }

  const translations = {
    back: { uz: 'Katalogga qaytish', ru: 'Назад в каталог', en: 'Back to catalog', fi: 'Takaisin', sv: 'Tillbaka' },
    color: { uz: 'Rang', ru: 'Цвет', en: 'Color', fi: 'Väri', sv: 'Färg' },
    size: { uz: 'O\'lcham', ru: 'Размер', en: 'Size', fi: 'Koko', sv: 'Storlek' },
    sizeChart: { uz: 'O\'lcham jadvali', ru: 'Таблица размеров', en: 'Size chart', fi: 'Kokotaulukko', sv: 'Storleksguide' },
    quantity: { uz: 'Miqdor', ru: 'Количество', en: 'Quantity', fi: 'Määrä', sv: 'Antal' },
    addToCart: { uz: 'Savatga qo\'shish', ru: 'В корзину', en: 'Add to cart', fi: 'Lisää ostoskoriin', sv: 'Lägg i varukorg' },
    added: { uz: 'Qo\'shildi!', ru: 'Добавлено!', en: 'Added!', fi: 'Lisätty!', sv: 'Tillagd!' },
    buyNow: { uz: 'Hoziroq xarid', ru: 'Купить сейчас', en: 'Buy now', fi: 'Osta nyt', sv: 'Köp nu' },
    description: { uz: 'Tavsif', ru: 'Описание', en: 'Description', fi: 'Kuvaus', sv: 'Beskrivning' },
    reviews: { uz: 'Sharhlar', ru: 'Отзывы', en: 'Reviews', fi: 'Arvostelut', sv: 'Recensioner' },
    shipping: { uz: 'Yetkazib berish', ru: 'Доставка', en: 'Shipping', fi: 'Toimitus', sv: 'Frakt' },
    leaveReview: { uz: 'Sharh qoldirish', ru: 'Оставить отзыв', en: 'Leave a review', fi: 'Jätä arvostelu', sv: 'Lämna recension' },
    yourReview: { uz: 'Sharhingiz...', ru: 'Ваш отзыв...', en: 'Your review...', fi: 'Arvostelusi...', sv: 'Din recension...' },
    submit: { uz: 'Yuborish', ru: 'Отправить', en: 'Submit', fi: 'Lähetä', sv: 'Skicka' },
    related: { uz: 'O\'xshash mahsulotlar', ru: 'Похожие товары', en: 'Related products', fi: 'Samankaltaiset', sv: 'Liknande' },
    freeShipping: { uz: 'Yetkazib berish 15 kun ichida', ru: 'Доставка за 15 дней', en: 'Shipping within 15 days', fi: 'Toimitus 15 pv:ssa', sv: 'Frakt inom 15 dagar' },
    easyReturn: { uz: '15 kun qaytarish', ru: 'Возврат 15 дней', en: '15-day returns', fi: '15 pv palautus', sv: '15 dagars retur' },
    warranty: { uz: '1 yil kafolat', ru: 'Гарантия 1 год', en: '1 year warranty', fi: '1 v takuu', sv: '1 års garanti' },
    delivStandard: { uz: 'Standart yetkazib berish', ru: 'Стандартная доставка', en: 'Standard delivery', fi: 'Vakiotoimitus', sv: 'Standard leverans' },
    delivStandardDesc: { uz: '15-30 ish kuni. $100 dan ortiq buyurtmalarda bepul.', ru: '15-30 рабочих дней. Бесплатно при заказе от $100.', en: '15-30 business days. Free on orders over $100.', fi: '15-30 työpäivää. Ilmainen yli $100 tilauksille.', sv: '15-30 arbetsdagar. Gratis vid beställningar över $100.' },
    retHead: { uz: 'Qaytarish', ru: 'Возврат', en: 'Returns', fi: 'Palautukset', sv: 'Returer' },
    retDesc: { uz: 'Mablag\'lar 2 kun ichida qaytariladi.', ru: 'Средства возвращаются в течение 2 дней.', en: 'Funds are returned within 2 days.', fi: 'Rahat palautetaan 2 päivän kuluessa.', sv: 'Pengar återbetalas inom 2 dagar.' },
  }

  const tr = (key) => translations[key]?.[locale] || translations[key]?.uz || key

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">{tr('back')}</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="space-y-4"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/5">
                <Image
                  src={allImages[currentImage]}
                  alt={productName(product)}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1.5 bg-[#ccff00] text-black text-xs font-black rounded-full">NEW</span>
                  )}
                  {product.isLimited && (
                    <span className="px-3 py-1.5 bg-white text-black text-xs font-black rounded-full">LIMITED</span>
                  )}
                  {product.oldPrice && (
                    <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                <button className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all">
                  <Share2 size={17} />
                </button>
              </div>

              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === i ? 'border-[#ccff00]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Image src={img} alt={`${productName(product)} ${i + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">TENZA</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">{productName(product)}</h1>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} className={star <= Math.round(avgRating) ? 'fill-[#ccff00] text-[#ccff00]' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{avgRating.toFixed(1)}</span>
                <span className="text-gray-600 text-sm">({reviews.length})</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span suppressHydrationWarning className="text-4xl font-black text-[#ccff00]">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <>
                    <span suppressHydrationWarning className="text-xl text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                    <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {product.stock !== undefined && (
                <div className="flex items-center gap-4">
                  <StockIndicator stock={product.stock} locale={locale} />
                  <SoldCount sold={product.sold} locale={locale} />
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-3 font-medium">{tr('color')}:</p>
                <div className="flex gap-3">
                  {product.colors?.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="relative w-10 h-10 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-[#ccff00] ring-offset-2 ring-offset-[#050505]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm font-medium">{tr('size')}:</p>
                  <button className="text-[#ccff00] text-xs underline hover:no-underline">{tr('sizeChart')}</button>
                </div>
                <div className="flex gap-2">
                  {product.sizes?.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-[#ccff00] text-black scale-105 shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-3 font-medium">{tr('quantity')}:</p>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1 w-fit">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-white hover:text-[#ccff00] transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(10, q + 1))} className="w-10 h-10 flex items-center justify-center text-white hover:text-[#ccff00] transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    added ? 'bg-green-500 text-white' : 'bg-[#ccff00] text-black hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]'
                  }`}
                >
                  {added ? <Check size={22} /> : <ShoppingCart size={22} />}
                  {added ? tr('added') : tr('addToCart')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    liked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white hover:border-red-500/50'
                  }`}
                >
                  <Heart size={24} className={liked ? 'fill-current' : ''} />
                </motion.button>
              </div>

              <Link href="/checkout" className="block w-full py-4 text-center rounded-2xl font-bold text-lg bg-white text-black hover:bg-gray-200 transition-all">
                {tr('buyNow')}
              </Link>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                {[
                  { icon: Truck, text: tr('freeShipping') },
                  { icon: RotateCcw, text: t('return_policy') },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <item.icon size={18} className="text-[#ccff00] mx-auto mb-1.5" />
                    <p className="text-gray-400 text-[10px] leading-tight">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mb-20">
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
              {['description', 'reviews', 'shipping'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
                    activeTab === tab ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                >
                  {tab === 'reviews' ? `${tr('reviews')} (${reviews.length})` : tr(tab)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-gray-400 leading-relaxed max-w-2xl">
                  <p className="mb-4">{product.description || 'Премиальная одежда от TENZA. Каждая вещь создаётся ограниченным тиражом с вниманием к деталям. Уникальный дизайн, высокое качество материалов.'}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><Check size={14} className="text-[#ccff00]" /> 100% премиум материалы</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-[#ccff00]" /> Усиленные швы</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-[#ccff00]" /> Эксклюзивный дизайн</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-[#ccff00]" /> Ограниченный тираж</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="text-center">
                      <p className="text-5xl font-black text-white">{avgRating.toFixed(1)}</p>
                      <div className="flex mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'fill-[#ccff00] text-[#ccff00]' : 'text-gray-600'} />
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{reviews.length} {tr('reviews').toLowerCase()}</p>
                    </div>
                    <div className="flex-1 space-y-1 w-full">
                      {[5,4,3,2,1].map(rating => {
                        const count = reviews.filter(r => r.rating === rating).length
                        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={rating} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 w-3">{rating}</span>
                            <Star size={12} className="fill-[#ccff00] text-[#ccff00]" />
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ccff00] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-gray-500 text-xs w-8">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                    <p className="text-white font-bold mb-3">{tr('leaveReview')}</p>
                    <div className="flex gap-1 mb-3">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setUserRating(star)}>
                          <Star size={24} className={star <= userRating ? 'fill-[#ccff00] text-[#ccff00]' : 'text-gray-600 hover:text-[#ccff00] transition-colors'} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder={tr('yourReview')}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none focus:border-[#ccff00]/50 outline-none mb-3"
                    />
                    <button
                      onClick={submitReview}
                      disabled={userRating === 0 || !reviewText.trim()}
                      className="px-6 py-2.5 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {tr('submit')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviews.map(review => (
                      <ReviewCard key={review.id} review={review} locale={locale} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div key="ship" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-gray-400 max-w-2xl space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl">
                    <Truck size={20} className="text-[#ccff00] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">{tr('delivStandard')}</p>
                      <p className="text-sm">{tr('delivStandardDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl">
                    <RotateCcw size={20} className="text-[#ccff00] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">{tr('retHead')}</p>
                      <p className="text-sm">{tr('retDesc')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">{tr('related')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(rp => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
    </div>
  )
}