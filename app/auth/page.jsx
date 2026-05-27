'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, UserPlus, LogIn, Sparkles, LogOut, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/i18n'
import Header from '../components/Header'

export default function AuthPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { register, login, user, logout } = useAuth()
  
  const [isRegister, setIsRegister] = useState(false)
  const [loginForm, setLoginForm] = useState({ login: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ login: '', password: '', confirmPassword: '', referralCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPwd, setShowPwd] = useState({ regPwd: false, regConfirm: false, loginPwd: false })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = login(loginForm.login, loginForm.password)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(getErrorMessage(result.error))
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError(t('password_mismatch') || 'Parollar mos kelmaydi')
      setLoading(false)
      return
    }
    
    const result = register(registerForm.login, registerForm.password, registerForm.referralCode)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(getErrorMessage(result.error))
    }
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
    setIsRegister(false)
    setLoginForm({ login: '', password: '' })
  }

  const getErrorMessage = (key) => {
    const map = {
      'USER_NOT_FOUND': t('user_not_found') || 'Foydalanuvchi topilmadi',
      'WRONG_PASSWORD': t('wrong_password') || 'Parol notog\'ri',
      'Login va parol kiritish majburiy': t('fill_all') || 'Login va parol kiritish majburiy',
      'Login kamida 3 belgi bolishi kerak': t('login_min') || 'Login kamida 3 belgi bolishi kerak',
      'Parol kamida 4 belgi bolishi kerak': t('password_min') || 'Parol kamida 4 belgi bolishi kerak',
      'Bu login allaqachon ishlatilgan': t('login_taken') || 'Bu login allaqachon ishlatilgan',
    }
    return map[key] || key
  }

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Header />
        <main className="pt-24 pb-8">
          <div className="max-w-lg mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
              <div className="w-20 h-20 rounded-full bg-[#ccff00]/20 flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-[#ccff00]" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">{t('welcome') || 'Xush kelibsiz'}!</h1>
<p className="text-gray-400 mb-4">{user.login}</p>
               
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-left mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold text-2xl">{user.coins || 0}</span>
                  <span className="text-gray-400 text-sm">{t('coins') || 'coins'}</span>
                </div>
                <p className="text-gray-400 text-xs mt-3 mb-2">
                  {t('your_referral') || 'Sizning referal kodingiz'}:
                </p>
                <button onClick={copyReferral} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg w-full hover:bg-white/10 transition-all">
                  <span className="text-white font-mono flex-1 text-left">{user.referralCode}</span>
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                </button>
              </div>
              
              <button onClick={() => router.push('/')} className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-xl mb-3">
                {t('continue_shopping') || 'Xaridni davom ettirish'}
              </button>
              
              <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2">
                <LogOut size={18} />
                {t('logout') || 'Chiqish'}
              </button>
            </motion.div>
          </div>
        </main>
        
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-lg mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setIsRegister(false)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isRegister ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-400'}`}>
                <LogIn size={18} className="inline mr-2" />
                {t('login') || 'Kirish'}
              </button>
              <button onClick={() => setIsRegister(true)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${isRegister ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-400'}`}>
                <UserPlus size={18} className="inline mr-2" />
                {t('register') || 'Royxatdan otish'}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('login') || 'Login'} *</label>
                  <input type="text" value={registerForm.login} onChange={e => setRegisterForm({...registerForm, login: e.target.value})}
                    placeholder="user123"
                    minLength={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50" />
                  <p className="text-gray-500 text-xs mt-1">Kamida 3 belgi</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('password') || 'Parol'} *</label>
                  <div className="relative">
                    <input type={showPwd.regPwd ? 'text' : 'password'} value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                      placeholder="*****"
                      minLength={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50 pr-12" />
                    <button type="button" onClick={() => setShowPwd({...showPwd, regPwd: !showPwd.regPwd})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPwd.regPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Kamida 4 belgi</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('confirm_password') || 'Parolni tasdiqlash'} *</label>
                  <div className="relative">
                    <input type={showPwd.regConfirm ? 'text' : 'password'} value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      placeholder="*****"
                      minLength={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50 pr-12" />
                    <button type="button" onClick={() => setShowPwd({...showPwd, regConfirm: !showPwd.regConfirm})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPwd.regConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('referral_code') || 'Referal kod (ixtiyoriy)'}</label>
                  <input type="text" value={registerForm.referralCode} onChange={e => setRegisterForm({...registerForm, referralCode: e.target.value.toUpperCase()})}
                    placeholder="TENZA-XXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-[#ccff00] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                  {loading ? <Sparkles size={20} className="animate-spin" /> : <UserPlus size={20} />}
                  {t('register') || 'Royxatdan otish'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('login') || 'Login'} *</label>
                  <input type="text" value={loginForm.login} onChange={e => setLoginForm({...loginForm, login: e.target.value})}
                    placeholder="user123"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50" />
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">{t('password') || 'Parol'} *</label>
                  <div className="relative">
                    <input type={showPwd.loginPwd ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      placeholder="*****"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#ccff00]/50 pr-12" />
                    <button type="button" onClick={() => setShowPwd({...showPwd, loginPwd: !showPwd.loginPwd})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPwd.loginPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-[#ccff00] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                  {loading ? <Sparkles size={20} className="animate-spin" /> : <LogIn size={20} />}
                  {t('login') || 'Kirish'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      
    </div>
  )
}