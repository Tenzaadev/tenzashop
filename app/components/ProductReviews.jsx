'use client'
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useAuth } from '@/context/AuthContext'

const L = {
  uz: {
    title: "Baholar va Izohlar", average: "O'rtacha baho", total: "ta izoh", noReviews: "Hali izohlar yo'q",
    noReviewsDesc: "Birinchi bo'lib izoh qoldiring!", leaveReview: "Izoh qoldirish", yourRating: "Baholang:",
    commentPlaceholder: "Izoh yozing (ixtiyoriy)...", submit: "Yuborish", loginRequired: "Izoh qoldirish uchun tizimga kiring",
    login: "Kirish", rating: "Baho",
  },
  ru: {
    title: "Оценки и Отзывы", average: "Средняя оценка", total: "отзывов", noReviews: "Отзывов пока нет",
    noReviewsDesc: "Будьте первым, кто оставит отзыв!", leaveReview: "Оставить отзыв", yourRating: "Оцените:",
    commentPlaceholder: "Напишите отзыв (необязательно)...", submit: "Отправить", loginRequired: "Войдите, чтобы оставить отзыв",
    login: "Войти", rating: "Оценка",
  },
  en: {
    title: "Ratings & Reviews", average: "Average rating", total: "reviews", noReviews: "No reviews yet",
    noReviewsDesc: "Be the first to leave a review!", leaveReview: "Leave a review", yourRating: "Rate:",
    commentPlaceholder: "Write a comment (optional)...", submit: "Submit", loginRequired: "Login to leave a review",
    login: "Login", rating: "Rating",
  },
  fi: {
    title: "Arvosanat ja arvostelut", average: "Keskiarvo", total: "arvostelua", noReviews: "Ei arvosteluja vielä",
    noReviewsDesc: "Ole ensimmäinen, joka jättää arvostelun!", leaveReview: "Jätä arvostelu", yourRating: "Arvioi:",
    commentPlaceholder: "Kirjoita kommentti (valinnainen)...", submit: "Lähetä", loginRequired: "Kirjaudu sisään jättääksesi arvostelu",
    login: "Kirjaudu", rating: "Arvosana",
  },
  sv: {
    title: "Betyg och recensioner", average: "Genomsnittligt betyg", total: "recensioner", noReviews: "Inga recensioner än",
    noReviewsDesc: "Bli först med att lämna en recension!", leaveReview: "Lämna recension", yourRating: "Betygsätt:",
    commentPlaceholder: "Skriv en kommentar (valfritt)...", submit: "Skicka", loginRequired: "Logga in för att lämna recension",
    login: "Logga in", rating: "Betyg",
  },
}

export function getProductReviews(productId) {
  try {
    const all = JSON.parse(localStorage.getItem('tenza_reviews') || '[]')
    return all.filter(r => r.productId === productId)
  } catch { return [] }
}

export function getAllReviews() {
  try {
    return JSON.parse(localStorage.getItem('tenza_reviews') || '[]')
  } catch { return [] }
}

export function saveReview({ productId, orderId, userId, userName, rating, comment, existingId, photos }) {
  const reviews = getAllReviews()
  const now = new Date().toISOString()
  const review = {
    id: existingId || 'REV-' + Date.now().toString(36),
    productId,
    orderId: orderId || null,
    userId: userId || 'anonymous',
    userName: userName || 'Mijoz',
    rating,
    comment: (comment || '').trim(),
    photos: photos || [],
    createdAt: existingId ? (reviews.find(r => r.id === existingId)?.createdAt || now) : now,
    updatedAt: now,
  }
  const filtered = reviews.filter(r => r.id !== review.id)
  filtered.push(review)
  localStorage.setItem('tenza_reviews', JSON.stringify(filtered))
  window.dispatchEvent(new CustomEvent('reviews-updated'))
  return review
}

export function deleteReview(reviewId) {
  const reviews = getAllReviews().filter(r => r.id !== reviewId)
  localStorage.setItem('tenza_reviews', JSON.stringify(reviews))
  window.dispatchEvent(new CustomEvent('reviews-updated'))
}

export default function ProductReviews({ productId }) {
  const { locale } = useI18n()
  const { user } = useAuth()
  const lang = L[locale] || L.uz
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: [0, 0, 0, 0, 0] })
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = () => {
    const productReviews = getProductReviews(productId)
    setReviews(productReviews.reverse())
    if (productReviews.length > 0) {
      const total = productReviews.length
      const sum = productReviews.reduce((s, r) => s + r.rating, 0)
      const dist = [0, 0, 0, 0, 0]
      productReviews.forEach(r => dist[r.rating - 1]++)
      setStats({ average: +(sum / total).toFixed(1), total, distribution: dist })
    } else {
      setStats({ average: 0, total: 0, distribution: [0, 0, 0, 0, 0] })
    }
  }

  useEffect(() => {
    loadReviews()
    const h = () => loadReviews()
    window.addEventListener('reviews-updated', h)
    return () => window.removeEventListener('reviews-updated', h)
  }, [productId])

  const handleSubmit = () => {
    if (newRating === 0 || !user) return
    setSubmitting(true)
    saveReview({
      productId,
      userId: user.login,
      userName: user.login,
      rating: newRating,
      comment: newComment,
    })
    setNewRating(0)
    setNewComment('')
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">{lang.title}</h3>

      {stats.total > 0 && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-black text-white">{stats.average}</p>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} className={s <= Math.round(stats.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">{stats.total} {lang.total}</p>
            </div>
            <div className="flex-1 space-y-1 w-full">
              {[5, 4, 3, 2, 1].map(star => {
                const count = stats.distribution[star - 1]
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 w-3">{star}</span>
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-500 text-xs w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {user ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <p className="text-white font-bold mb-3">{lang.leaveReview}</p>
          <p className="text-gray-400 text-xs mb-2">{lang.yourRating}</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => setNewRating(star)}
                className={`text-2xl transition-all ${
                  star <= newRating ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-300 hover:scale-105'
                }`}>
                ★
              </button>
            ))}
          </div>
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
            placeholder={lang.commentPlaceholder} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none focus:border-[#ccff00]/50 outline-none mb-3" />
          <button onClick={handleSubmit} disabled={newRating === 0 || submitting}
            className="px-6 py-2.5 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-30">
            {lang.submit}
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">{lang.loginRequired}</p>
          <a href="/login" className="px-6 py-2.5 bg-[#ccff00] text-black font-bold rounded-xl inline-block hover:bg-white transition-all">
            {lang.login}
          </a>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400">{lang.noReviews}</p>
          <p className="text-gray-600 text-sm mt-1">{lang.noReviewsDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#ccff00]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#ccff00] font-bold text-sm">{(review.userName || '?').charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-white font-medium text-sm">{review.userName}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-gray-300 text-sm mt-2">{review.comment}</p>}
              <p className="text-gray-600 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
