'use client'
import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'

const L = {
  uz: { rate: "Baholang:", comment: "Izohingiz:", commentPlace: "Mahsulot haqida fikringizni yozing...", photos: "Rasmlar (ixtiyoriy):", addPhoto: "Rasm", maxPhotos: "Maksimal 5 ta rasm", save: "Izoh qoldirish", edit: "Tahrirlash" },
  ru: { rate: "Оцените:", comment: "Ваш отзыв:", commentPlace: "Напишите отзыв о товаре...", photos: "Фото (необязательно):", addPhoto: "Фото", maxPhotos: "Максимум 5 фото", save: "Оставить отзыв", edit: "Редактировать" },
  en: { rate: "Rate:", comment: "Your review:", commentPlace: "Write your review...", photos: "Photos (optional):", addPhoto: "Photo", maxPhotos: "Max 5 photos", save: "Leave review", edit: "Edit" },
  fi: { rate: "Arvioi:", comment: "Arvostelusi:", commentPlace: "Kirjoita arvostelusi...", photos: "Kuvat (valinnainen):", addPhoto: "Kuva", maxPhotos: "Max 5 kuvaa", save: "Jätä arvostelu", edit: "Muokkaa" },
  sv: { rate: "Betygsätt:", comment: "Din recension:", commentPlace: "Skriv din recension...", photos: "Bilder (valfritt):", addPhoto: "Bild", maxPhotos: "Max 5 bilder", save: "Lämna recension", edit: "Redigera" },
}

export default function PhotoReview({ productId, orderId, existingReview, onSave, locale = 'uz' }) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [photos, setPhotos] = useState(existingReview?.photos || [])
  const [hoveredStar, setHoveredStar] = useState(0)
  const fileInputRef = useRef(null)
  const lang = L[locale] || L.uz

  const handlePhotoSelect = (e) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) return
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) return
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotos(prev => prev.length < 5 ? [...prev, event.target.result] : prev)
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => setPhotos(prev => prev.filter((_, i) => i !== index))

  const handleSave = () => {
    if (rating === 0) return
    onSave({
      id: existingReview?.id || 'REV-' + Date.now().toString(36),
      productId, orderId,
      userId: existingReview?.userId,
      userName: existingReview?.userName,
      rating, comment: comment.trim(), photos,
      createdAt: existingReview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-400 mb-2">{lang.rate}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}
              className={`text-3xl transition-all ${star <= (hoveredStar || rating) ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-300'}`}>★</button>
          ))}
          {rating > 0 && <span className="text-gray-400 text-sm ml-2">{rating}/5</span>}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">{lang.comment}</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder={lang.commentPlace} rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 resize-none outline-none focus:border-[#ccff00]/50" />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">{lang.photos}</label>
        <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/png,image/jpeg,image/gif,image/webp" multiple className="hidden" />
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img src={photo} alt={`Photo ${index + 1}`} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
              <button onClick={() => removePhoto(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={12} className="text-white" /></button>
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#ccff00]/50 transition-all">
              <Camera size={20} className="text-gray-500" />
              <span className="text-xs text-gray-600">{lang.addPhoto}</span>
            </button>
          )}
        </div>
        <p className="text-gray-600 text-xs mt-1">{lang.maxPhotos}</p>
      </div>

      <button onClick={handleSave} disabled={rating === 0}
        className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-xl disabled:opacity-30 hover:bg-white transition-all">
        {existingReview ? lang.edit : lang.save}
      </button>
    </div>
  )
}
