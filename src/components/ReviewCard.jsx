'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

export default function ReviewCard({ review, locale = 'uz' }) {
  const [expandedPhotos, setExpandedPhotos] = useState(false)

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ccff00]/20 rounded-full flex items-center justify-center">
            <span className="text-[#ccff00] font-bold text-sm">{(review.userName || '?').charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-white font-medium text-sm">{review.userName}</span>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
          ))}
        </div>
      </div>

      {review.comment && <p className="text-gray-300 text-sm mb-3">{review.comment}</p>}

      {review.photos && review.photos.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {review.photos.slice(0, expandedPhotos ? review.photos.length : 4).map((photo, i) => (
              <div key={i} className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(photo, '_blank')}>
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {review.photos.length > 4 && !expandedPhotos && (
              <button onClick={() => setExpandedPhotos(true)}
                className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 text-sm hover:bg-white/10">
                +{review.photos.length - 4}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-gray-600 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  )
}
