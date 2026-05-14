'use client'
import { useState, useRef } from 'react'
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react'

const L = {
  uz: { fromPhone: "Telefondan", viaUrl: "URL orqali", select: "Rasm tanlang", drag: "Bosib tanlang yoki sudrab keling", formats: "PNG, JPG, GIF (max 5MB)", upload: "Yuklash", productImage: "Mahsulot rasmi" },
  ru: { fromPhone: "С телефона", viaUrl: "По URL", select: "Выберите фото", drag: "Нажмите или перетащите", formats: "PNG, JPG, GIF (макс 5МБ)", upload: "Загрузить", productImage: "Изображение товара" },
  en: { fromPhone: "From phone", viaUrl: "Via URL", select: "Select photo", drag: "Click or drag & drop", formats: "PNG, JPG, GIF (max 5MB)", upload: "Upload", productImage: "Product image" },
  fi: { fromPhone: "Puhelimesta", viaUrl: "URL:n kautta", select: "Valitse kuva", drag: "Napsauta tai vedä", formats: "PNG, JPG, GIF (max 5MB)", upload: "Lataa", productImage: "Tuotekuva" },
  sv: { fromPhone: "Från telefon", viaUrl: "Via URL", select: "Välj foto", drag: "Klicka eller dra", formats: "PNG, JPG, GIF (max 5MB)", upload: "Ladda upp", productImage: "Produktbild" },
}

export default function ImageUpload({ currentImage, onImageChange, locale = 'uz' }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMethod, setUploadMethod] = useState('file')
  const [imageUrl, setImageUrl] = useState('')
  const lang = L[locale] || L.uz

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) { alert('PNG, JPG, GIF, WebP only'); return }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setPreview(base64)
      onImageChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setPreview(base64)
      onImageChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setPreview(imageUrl)
      onImageChange(imageUrl)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-gray-400">{lang.productImage}</label>

      <div className="flex bg-white/5 rounded-xl p-1 gap-1">
        <button onClick={() => setUploadMethod('file')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${uploadMethod === 'file' ? 'bg-[#ccff00] text-black' : 'text-gray-400'}`}>
          <Upload size={14} /> {lang.fromPhone}
        </button>
        <button onClick={() => setUploadMethod('url')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${uploadMethod === 'url' ? 'bg-[#ccff00] text-black' : 'text-gray-400'}`}>
          <ImageIcon size={14} /> {lang.viaUrl}
        </button>
      </div>

      {uploadMethod === 'file' ? (
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" />
          {preview ? (
            <div className="relative">
              <img src={preview} alt="" className="w-full h-48 object-cover rounded-2xl border border-white/10" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-black/70 rounded-xl text-white hover:bg-black/90"><Camera size={16} /></button>
                <button onClick={handleRemove} className="p-2 bg-red-500/70 rounded-xl text-white hover:bg-red-600/90"><X size={16} /></button>
              </div>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-[#ccff00] bg-[#ccff00]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
              <Upload size={32} className="text-gray-500 mx-auto mb-3" />
              <p className="text-white font-medium">{lang.select}</p>
              <p className="text-gray-500 text-sm mt-1">{lang.drag}</p>
              <p className="text-gray-600 text-xs mt-2">{lang.formats}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50" />
            <button onClick={handleUrlSubmit}
              className="px-4 py-3 bg-[#ccff00] text-black font-bold rounded-xl">{lang.upload}</button>
          </div>
          {preview && (
            <div className="relative">
              <img src={preview} alt="" className="w-full h-48 object-cover rounded-2xl border border-white/10" />
              <button onClick={handleRemove} className="absolute top-2 right-2 p-2 bg-red-500/70 rounded-xl text-white"><X size={16} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
