const M = {
  uz: {
    loginRequired: 'Login kiritish majburiy',
    loginMin: 'Login kamida 3 belgi bolishi kerak',
    loginMax: 'Login 20 belgidan oshmasligi kerak',
    loginInvalid: 'Login faqat harflar raqamlar va _ bilan boshlanishi mumkin',
    passwordRequired: 'Parol kiritish majburiy',
    passwordMin: 'Parol kamida 4 belgi bolishi kerak',
    passwordMismatch: 'Parollar mos kelmaydi',
    referralInvalid: "Referal kodi notog'ri format",
    emailInvalid: "Email notog'ri format",
    emailRequired: 'Email kiritish majburiy',
  },
  ru: {
    loginRequired: 'Логин обязателен',
    loginMin: 'Логин должен быть минимум 3 символа',
    loginMax: 'Логин не должен превышать 20 символов',
    loginInvalid: 'Логин может содержать только буквы цифры и _',
    passwordRequired: 'Пароль обязателен',
    passwordMin: 'Пароль должен быть минимум 4 символа',
    passwordMismatch: 'Пароли не совпадают',
    referralInvalid: 'Неверный формат реферального кода',
    emailInvalid: 'Неверный формат email',
    emailRequired: 'Email обязателен',
  },
  en: {
    loginRequired: 'Login is required',
    loginMin: 'Login must be at least 3 characters',
    loginMax: 'Login must not exceed 20 characters',
    loginInvalid: 'Login can only contain letters numbers and _',
    passwordRequired: 'Password is required',
    passwordMin: 'Password must be at least 4 characters',
    passwordMismatch: 'Passwords do not match',
    referralInvalid: 'Invalid referral code format',
    emailInvalid: 'Invalid email format',
    emailRequired: 'Email is required',
  },
  fi: {
    loginRequired: 'Käyttäjätunnus vaaditaan',
    loginMin: 'Käyttäjätunnuksen oltava vähintään 3 merkkiä',
    loginMax: 'Käyttäjätunnus enintään 20 merkkiä',
    loginInvalid: 'Käyttäjätunnus voi sisältää vain kirjaimia numeroita ja _',
    passwordRequired: 'Salasana vaaditaan',
    passwordMin: 'Salasanan oltava vähintään 4 merkkiä',
    passwordMismatch: 'Salasanat eivät täsmää',
    referralInvalid: 'Virheellinen kutsukoodin muoto',
    emailInvalid: 'Virheellinen sähköpostimuoto',
    emailRequired: 'Sähköposti vaaditaan',
  },
  sv: {
    loginRequired: 'Inloggning krävs',
    loginMin: 'Inloggning måste vara minst 3 tecken',
    loginMax: 'Inloggning får inte överstiga 20 tecken',
    loginInvalid: 'Inloggning kan endast innehålla bokstäver siffror och _',
    passwordRequired: 'Lösenord krävs',
    passwordMin: 'Lösenord måste vara minst 4 tecken',
    passwordMismatch: 'Lösenorden matchar inte',
    referralInvalid: 'Ogiltigt referenskodformat',
    emailInvalid: 'Ogiltigt e-postformat',
    emailRequired: 'E-post krävs',
  },
}

function msg(key, locale) {
  return M[locale]?.[key] || M.en[key] || key
}

const LOGIN_RE = /^[a-zA-Z0-9_]{3,20}$/
const REFERRAL_RE = /^TENZA-[A-Z0-9]{6}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(value, locale) {
  if (!value || !value.trim()) return msg('loginRequired', locale)
  if (value.trim().length < 3) return msg('loginMin', locale)
  if (value.trim().length > 20) return msg('loginMax', locale)
  if (!LOGIN_RE.test(value.trim())) return msg('loginInvalid', locale)
  return null
}

export function validatePassword(value, locale) {
  if (!value) return msg('passwordRequired', locale)
  if (value.length < 4) return msg('passwordMin', locale)
  return null
}

export function validateConfirmPassword(password, confirm, locale) {
  if (password !== confirm) return msg('passwordMismatch', locale)
  return null
}

export function validateReferralCode(code, locale) {
  if (!code || !code.trim()) return null
  if (!REFERRAL_RE.test(code.trim())) return msg('referralInvalid', locale)
  return null
}

export function validateEmail(value, locale) {
  if (!value || !value.trim()) return msg('emailRequired', locale)
  if (!EMAIL_RE.test(value.trim())) return msg('emailInvalid', locale)
  return null
}
