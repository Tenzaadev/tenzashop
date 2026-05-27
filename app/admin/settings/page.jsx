'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, CheckCircle, Link, ExternalLink, RefreshCw, User } from 'lucide-react'

const L = {
  uz: {
    title: "Sozlamalar", referralTitle: "Referal havolalar",
    referralDesc: "Email manzilingizni kiriting va shaxsiy referal havolangizni yarating. Do'stlaringizni taklif qiling va imtiyozlarga ega bo'ling!",
    generateBtn: "Yaratish", copied: "Nusxalandi!", yourLink: "Sizning havolangiz",
    shareText: "Bu havolani do'stlaringiz bilan ulashing",
  },
  ru: {
    title: "Настройки", referralTitle: "Реферальные ссылки",
    referralDesc: "Введите адрес электронной почты и создайте свою персональную реферальную ссылку. Приглашайте друзей и получайте преимущества!",
    generateBtn: "Создать", copied: "Скопировано!", yourLink: "Ваша ссылка",
    shareText: "Поделитесь этой ссылкой с друзьями",
  },
  en: {
    title: "Settings", referralTitle: "Referral Links",
    referralDesc: "Enter your email address and generate your personal referral link. Invite friends and earn benefits!",
    generateBtn: "Generate", copied: "Copied!", yourLink: "Your Link",
    shareText: "Share this link with your friends",
  },
  fi: {
    title: "Asetukset", referralTitle: "Kumppanilinkit",
    referralDesc: "Syötä sähköpostiosoitteesi ja luo henkilökohtainen kumppanilinkkisi. Kutsu ystäviä ja ansaitse etuja!",
    generateBtn: "Luo", copied: "Kopioitu!", yourLink: "Linkkisi",
    shareText: "Jaa tämä linkki ystäviesi kanssa",
  },
  sv: {
    title: "Inställningar", referralTitle: "Referallänkar",
    referralDesc: "Ange din e-postadress och skapa din personliga referallänk. Bjud in vänner och få förmåner!",
    generateBtn: "Skapa", copied: "Kopierad!", yourLink: "Din länk",
    shareText: "Dela denna länk med dina vänner",
  },
}

export default function AdminSettingsPage() {
  const [locale, setLocale] = useState('uz')
  const [email, setEmail] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const lang = L[locale] || L.uz

  useEffect(() => {
    const saved = localStorage.getItem('tenza_lang')
    if (saved) setLocale(saved)
    const h = (e) => setLocale(e.detail || 'uz')
    window.addEventListener('language-changed', h)
    return () => window.removeEventListener('language-changed', h)
  }, [])

  const handleGenerate = () => {
    if (!email.trim()) { setError('Email kiriting'); return }
    if (!email.includes('@')) { setError('Noto\'g\'ri email format'); return }
    setError('')
    const encoded = btoa(email.trim()).replace(/=/g, '')
    const generated = `${window.location.origin}/?ref=${encoded}`
    setLink(generated)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white mb-2">{lang.title}</h1>
          <p className="text-gray-400 mb-10">{lang.referralTitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center">
              <Link size={24} className="text-[#ccff00]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{lang.referralTitle}</h2>
              <p className="text-gray-500 text-sm">{lang.referralDesc}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="user@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#ccff00]/50 transition-colors" />
            </div>
            <button onClick={handleGenerate}
              className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center gap-2">
              <RefreshCw size={18} />
              {lang.generateBtn}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {link && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <ExternalLink size={14} />
                  {lang.yourLink}
                </h3>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}>
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? lang.copied : lang.copied.replace('!', '')}
                </button>
              </div>
              <div className="flex items-center gap-3 bg-[#050505] border border-white/5 rounded-xl px-4 py-3">
                <Link size={16} className="text-[#ccff00] flex-shrink-0" />
                <code className="text-white text-sm break-all font-mono">{link}</code>
              </div>
              <p className="text-gray-600 text-xs mt-3 flex items-center gap-1">
                <ExternalLink size={12} />
                {lang.shareText}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
