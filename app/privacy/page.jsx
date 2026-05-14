'use client'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { useI18n } from '@/i18n'
import privacyPolicy from '@/data/privacyPolicy'

export default function PrivacyPage() {
  const { locale } = useI18n()
  const policy = privacyPolicy[locale] || privacyPolicy.uz

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <Shield size={20} className="text-[#ccff00]" />
          <h1 className="text-lg font-bold text-white">{policy.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Last updated */}
          <p className="text-gray-500 text-sm mb-8">{policy.updated}</p>

          {/* Sections */}
          <div className="space-y-8">
            {policy.sections.map((section) => (
              <section key={section.number} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#ccff00]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#ccff00] font-bold text-sm">{section.number}</span>
                  </span>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-gray-300 leading-relaxed mb-4">{section.content}</p>
                )}

                {section.items && section.items.length > 0 && (
                  <ul className="space-y-2 mt-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]/60 mt-2 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="text-[#ccff00] text-sm font-medium mt-4 p-3 bg-[#ccff00]/5 rounded-xl border border-[#ccff00]/10">
                    {section.note}
                  </p>
                )}
              </section>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">
              {locale === 'uz' && 'Savollaringiz bormi? Biz bilan bog\'laning'}
              {locale === 'ru' && 'Есть вопросы? Свяжитесь с нами'}
              {locale === 'en' && 'Have questions? Contact us'}
              {locale === 'fi' && 'Onko kysyttävää? Ota yhteyttä'}
              {locale === 'sv' && 'Har du frågor? Kontakta oss'}
            </p>
            <Link href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-all">
              <ArrowLeft size={16} className="rotate-180" />
              {locale === 'uz' && "Qo'llab-quvvatlash"}
              {locale === 'ru' && 'Поддержка'}
              {locale === 'en' && 'Support'}
              {locale === 'fi' && 'Tuki'}
              {locale === 'sv' && 'Support'}
            </Link>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6 pb-10">
            <Link href="/" className="text-gray-500 hover:text-[#ccff00] text-sm transition-colors">
              &larr; {locale === 'uz' && 'Bosh sahifaga'}
              {locale === 'ru' && 'На главную'}
              {locale === 'en' && 'Back to home'}
              {locale === 'fi' && 'Takaisin etusivulle'}
              {locale === 'sv' && 'Tillbaka till startsidan'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
