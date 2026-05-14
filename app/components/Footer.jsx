'use client'
import Link from 'next/link'
import { useI18n } from '@/i18n'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500 text-sm mb-3">{t('footer_newsletter')}</p>
        <p className="text-gray-400 italic mb-4">{t('footer_quote')}</p>
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
          <Link href="/support" className="hover:text-[#ccff00] transition-colors">{t('support')}</Link>
          <Link href="/privacy" className="hover:text-[#ccff00] transition-colors">{t('footer_privacy')}</Link>
          <a href="#" className="hover:text-[#ccff00] transition-colors">{t('footer_terms')}</a>
        </div>
        <p className="text-gray-600 text-xs">© 2026 TENZA SHOP. {t('footer_rights')}</p>
      </div>
    </footer>
  )
}