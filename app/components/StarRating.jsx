'use client'

export default function StarRating({ rating, onRate, size = 'text-2xl', interactive = true, max = 5 }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex gap-0.5">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          className={`${size} transition-all ${
            interactive ? 'cursor-pointer' : 'cursor-default'
          } ${
            star <= rating
              ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]'
              : 'text-gray-600'
          } ${interactive ? 'hover:scale-110 hover:text-yellow-300' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
