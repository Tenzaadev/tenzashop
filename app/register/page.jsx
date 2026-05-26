'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, Sparkles, Eye, EyeOff, ArrowLeft, Gift, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/i18n'
import { validateLogin, validatePassword, validateConfirmPassword, validateReferralCode } from '@/utils/validation'
import { getReferrerName, getReferralLink } from '@/utils/referral'
import Header from '../components/Header'

const L = {
  uz: { title: "Ro'yxatdan o'tish", loginLabel: 'Login', passwordLabel: 'Parol', confirmLabel: 'Parolni tasdiqlash', referralLabel: 'Referal kod', referralPlaceholder: 'TENZA-XXXXXX', submit: "Ro'yxatdan o'tish", haveAccount: "Hisobingiz bormi?", loginLink: "Kirish", invitedBy: "Sizni taklif qildi!", bonusInfo: "Sizga +25 coin beriladi", minLogin: 'Kamida 3 belgi', minPassword: 'Kamida 4 belgi', back: 'Orqaga', loginTaken: 'Bu username allaqachon ishlatilgan', loginTakenDesc: 'Bu foydalanuvchi mavjud' },
  ru: { title: 'Регистрация', loginLabel: 'Логин', passwordLabel: 'Пароль', confirmLabel: 'Подтвердите пароль', referralLabel: 'Реферальный код', referralPlaceholder: 'TENZA-XXXXXX', submit: 'Зарегистрироваться', haveAccount: 'Есть аккаунт?', loginLink: 'Войти', invitedBy: 'Вас пригласили!', bonusInfo: 'Вы получите +25 монет', minLogin: 'Мин. 3 символа', minPassword: 'Мин. 4 символа', back: 'Назад', loginTaken: 'Этот логин уже используется', loginTakenDesc: 'Этот пользователь уже существует' },
  en: { title: 'Register', loginLabel: 'Login', passwordLabel: 'Password', confirmLabel: 'Confirm Password', referralLabel: 'Referral code', referralPlaceholder: 'TENZA-XXXXXX', submit: 'Register', haveAccount: 'Have an account?', loginLink: 'Login', invitedBy: 'You were invited!', bonusInfo: 'You get +25 coins', minLogin: 'Min 3 characters', minPassword: 'Min 4 characters', back: 'Back', loginTaken: 'This login is already taken', loginTakenDesc: 'This user already exists' },
  fi: { title: 'Rekisteröidy', loginLabel: 'Käyttäjätunnus', passwordLabel: 'Salasana', confirmLabel: 'Vahvista salasana', referralLabel: 'Kutsukoodi', referralPlaceholder: 'TENZA-XXXXXX', submit: 'Rekisteröidy', haveAccount: 'Onko sinulla tili?', loginLink: 'Kirjaudu', invitedBy: 'Sinut kutsuttiin!', bonusInfo: 'Saat +25 kolikkoa', minLogin: 'Min 3 merkkiä', minPassword: 'Min 4 merkkiä', back: 'Takaisin', loginTaken: 'Tämä käyttäjätunnus on jo käytössä', loginTakenDesc: 'Tämä käyttäjä on jo olemassa' },
  sv: { title: 'Registrera', loginLabel: 'Inloggning', passwordLabel: 'Lösenord', confirmLabel: 'Bekräfta lösenord', referralLabel: 'Referenskod', referralPlaceholder: 'TENZA-XXXXXX', submit: 'Registrera', haveAccount: 'Har du ett konto?', loginLink: 'Logga in', invitedBy: 'Du blev inbjuden!', bonusInfo: 'Du får +25 mynt', minLogin: 'Min 3 tecken', minPassword: 'Min 4 tecken', back: 'Tillbaka', loginTaken: 'Detta användarnamn används redan', loginTakenDesc: 'Denna användare finns redan' },
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useI18n()
  const { register, user, isLoginTaken } = useAuth()
  const lang = L[locale] || L.uz

  const [form, setForm] = useState({ login: '', password: '', confirmPassword: '' })
  const [referralCode, setReferralCode] = useState('')
  const [referrerName, setReferrerName] = useState(null)
  const [error, setError] = useState('')
  const [loginTaken, setLoginTaken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState({ pwd: false, confirm: false })

  function checkNicknameSync(nickname) {
    if (typeof window === 'undefined') return false
    try {
      const users = JSON.parse(localStorage.getItem('tenza_users') || '{}')
      const key = 'tenza_user_' + nickname.toLowerCase().trim()
      return !!users[key]
    } catch { return false }
  }

  useEffect(() => {
    if (form.login.trim().length >= 3) {
      setLoginTaken(checkNicknameSync(form.login.trim()))
    } else {
      setLoginTaken(false)
    }
  }, [form.login])

  useEffect(() => {
    const code = searchParams?.get('ref')
    if (code) {
      const cleaned = code.trim().toUpperCase()
      setReferralCode(cleaned)
      const name = getReferrerName(cleaned)
      if (name) setReferrerName(name)
    }
  }, [searchParams])

  if (user) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const loginErr = validateLogin(form.login, locale)
    if (loginErr) { setError(loginErr); return }

    if (checkNicknameSync(form.login.trim())) {
      setError(lang.loginTaken)
      return
    }

    const pwdErr = validatePassword(form.password, locale)
    if (pwdErr) { setError(pwdErr); return }

    const confirmErr = validateConfirmPassword(form.password, form.confirmPassword, locale)
    if (confirmErr) { setError(confirmErr); return }

    const refErr = validateReferralCode(referralCode, locale)
    if (refErr) { setError(refErr); return }

    setLoading(true)
    console.log('[REGISTER] attempting register for:', form.login)
    const result = await register(form.login, form.password, referralCode || null)
    console.log('[REGISTER] result:', result)
    console.log('[REGISTER] tenza_users after register:', localStorage.getItem('tenza_users'))

    if (result.success) {
      localStorage.setItem('tenza_user_email', form.login)
      router.push('/')
    } else {
      const errMap = {
        'Login va parol kiritish majburiy': "Barcha maydonlarni to'ldiring",
        'Login kamida 3 belgi bolishi kerak': lang.minLogin,
        'Parol kamida 4 belgi bolishi kerak': lang.minPassword,
        'Bu login allaqachon ishlatilgan': lang.loginTaken,
      }
      setError(errMap[result.error] || result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> {lang.back}
          </Link>

          {referrerName && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <Gift className="text-[#ccff00] flex-shrink-0" size={24} />
              <div>
                <p className="font-bold text-[#ccff00]">{referrerName} {lang.invitedBy}</p>
                <p className="text-gray-400 text-sm">{lang.bonusInfo}</p>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-black mb-6">{lang.title}</h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">{lang.loginLabel} *</label>
                <input type="text" value={form.login} onChange={e => setForm({...form, login: e.target.value})}
                  placeholder="user123" autoFocus
                  className={`w-full bg-white/5 border ${loginTaken ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50`} />
                {loginTaken ? (
                  <p className="text-red-400 text-xs mt-1">{lang.loginTaken}</p>
                ) : (
                  <p className="text-gray-600 text-xs mt-1">{lang.minLogin}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">{lang.passwordLabel} *</label>
                <div className="relative">
                  <input type={showPwd.pwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="*****"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50 pr-12" />
                  <button type="button" onClick={() => setShowPwd({...showPwd, pwd: !showPwd.pwd})}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPwd.pwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-gray-600 text-xs mt-1">{lang.minPassword}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">{lang.confirmLabel} *</label>
                <div className="relative">
                  <input type={showPwd.confirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    placeholder="*****"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50 pr-12" />
                  <button type="button" onClick={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPwd.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">{lang.referralLabel}</label>
                <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())}
                  placeholder={lang.referralPlaceholder} readOnly={!!referrerName}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50 ${referrerName ? 'opacity-60' : ''}`} />
                {referralCode && !referrerName && !validateReferralCode(referralCode, locale) && (
                  <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><Check size={12} /> {lang.bonusInfo}</p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#ccff00] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                {loading ? <Sparkles size={20} className="animate-spin" /> : <UserPlus size={20} />}
                {lang.submit}
              </button>
            </form>
          </motion.div>

          <p className="text-center text-gray-400 mt-6 text-sm">
            {lang.haveAccount}{' '}
            <Link href="/login" className="text-[#ccff00] hover:underline font-medium">{lang.loginLink}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Sparkles size={32} className="animate-spin text-[#ccff00]" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
