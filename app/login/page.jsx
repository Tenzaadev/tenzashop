'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/i18n'
import Header from '../components/Header'

const L = {
  uz: { title: 'Kirish', loginLabel: 'Login yoki Email', loginPlaceholder: 'user123 yoki user@mail.com', passwordLabel: 'Parol', submit: 'Kirish', noAccount: "Hisobingiz yo'qmi?", registerLink: "Ro'yxatdan o'tish", back: 'Orqaga', fillAll: "Barcha maydonlarni to'ldiring", wrongPassword: 'Parol noto\'g\'ri. Qayta urinib ko\'ring.', userNotFound: 'Bunday foydalanuvchi topilmadi. Avval ro\'yxatdan o\'ting.' },
  ru: { title: 'Вход', loginLabel: 'Логин или Email', loginPlaceholder: 'user123 или user@mail.com', passwordLabel: 'Пароль', submit: 'Войти', noAccount: 'Нет аккаунта?', registerLink: 'Регистрация', back: 'Назад', fillAll: 'Заполните все поля', wrongPassword: 'Неверный пароль. Попробуйте снова.', userNotFound: 'Пользователь не найден. Сначала зарегистрируйтесь.' },
  en: { title: 'Login', loginLabel: 'Login or Email', loginPlaceholder: 'user123 or user@mail.com', passwordLabel: 'Password', submit: 'Login', noAccount: "Don't have an account?", registerLink: 'Register', back: 'Back', fillAll: 'Fill all fields', wrongPassword: 'Wrong password. Try again.', userNotFound: 'User not found. Please register first.' },
  fi: { title: 'Kirjaudu', loginLabel: 'Käyttäjätunnus tai sähköposti', loginPlaceholder: 'user123 tai user@mail.com', passwordLabel: 'Salasana', submit: 'Kirjaudu', noAccount: 'Ei tiliä?', registerLink: 'Rekisteröidy', back: 'Takaisin', fillAll: 'Täytä kaikki kentät', wrongPassword: 'Väärä salasana. Yritä uudelleen.', userNotFound: 'Käyttäjää ei löydy. Rekisteröidy ensin.' },
  sv: { title: 'Logga in', loginLabel: 'Inloggning eller e-post', loginPlaceholder: 'user123 eller user@mail.com', passwordLabel: 'Lösenord', submit: 'Logga in', noAccount: 'Inget konto?', registerLink: 'Registrera', back: 'Tillbaka', fillAll: 'Fyll i alla fält', wrongPassword: 'Fel lösenord. Försök igen.', userNotFound: 'Användaren hittades inte. Registrera dig först.' },
}

export default function LoginPage() {
  const router = useRouter()
  const { locale } = useI18n()
  const { login, user } = useAuth()
  const lang = L[locale] || L.uz

  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    router.push('/')
    return null
  }

  function findLocalUser(value) {
    try {
      const raw = localStorage.getItem('tenza_users')
      console.log('[LOGIN] tenza_users raw:', raw)
      const users = JSON.parse(raw || '{}')
      console.log('[LOGIN] parsed users:', users)
      console.log('[LOGIN] user keys:', Object.keys(users))
      const key = 'tenza_user_' + value.toLowerCase().trim()
      console.log('[LOGIN] searching for key:', key)
      if (users[key]) {
        console.log('[LOGIN] FOUND by key:', users[key])
        return users[key]
      }
      const byEmail = Object.values(users).find(u => u.email?.toLowerCase() === value.toLowerCase().trim())
      console.log('[LOGIN] search by email result:', byEmail)
      return byEmail
    } catch (e) {
      console.log('[LOGIN] error:', e)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const val = loginValue.trim()
    const pass = password

    if (!val || !pass) {
      setError(lang.fillAll)
      return
    }

    setLoading(true)

    console.log('[LOGIN] attempting login for:', val)
    const found = findLocalUser(val)
    console.log('[LOGIN] found user:', found)

    if (!found) {
      console.log('[LOGIN] USER NOT FOUND')
      setError(lang.userNotFound)
      setLoading(false)
      return
    }

    if (found.password !== pass) {
      console.log('[LOGIN] WRONG PASSWORD')
      setError(lang.wrongPassword)
      setLoading(false)
      return
    }

    console.log('[LOGIN] LOGIN SUCCESS for:', found.login)
    localStorage.setItem('tenza_current_user', JSON.stringify(found))
    localStorage.setItem('tenza_user_email', found.email || val)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> {lang.back}
          </Link>

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
                <input type="text" value={loginValue} onChange={e => setLoginValue(e.target.value)}
                  placeholder={lang.loginPlaceholder} autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50" />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">{lang.passwordLabel} *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="*****"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#ccff00]/50 pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#ccff00] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                {loading ? <Sparkles size={20} className="animate-spin" /> : <LogIn size={20} />}
                {lang.submit}
              </button>
            </form>
          </motion.div>

          <p className="text-center text-gray-400 mt-6 text-sm">
            {lang.noAccount}{' '}
            <Link href="/register" className="text-[#ccff00] hover:underline font-medium">{lang.registerLink}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
