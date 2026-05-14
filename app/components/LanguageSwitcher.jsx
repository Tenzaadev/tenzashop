'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'

const languages = [
  { code: 'uz', flag: '🇺🇿', name: "O'zbekcha" },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fi', flag: '🇫🇮', name: 'Suomi' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const current = languages.find(l => l.code === locale) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ccff00]/50 flex items-center justify-center text-xl hover:scale-110 transition-all"
      >
        {current.flag}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 bg-[#111] border border-white/10 rounded-2xl p-2 z-50 w-48 shadow-2xl shadow-[#ccff00]/5"
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    locale === lang.code
                      ? 'bg-[#ccff00]/10 border border-[#ccff00]/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`font-medium ${locale === lang.code ? 'text-[#ccff00]' : 'text-white'}`}>
                    {lang.name}
                  </span>
                  {locale === lang.code && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#ccff00]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}