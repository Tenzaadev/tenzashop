'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const I18nContext = createContext(null)

const locales = [
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
]

const translations = {
  uz: {
    home: "Bosh sahifa", new: "Yangi", categories: "Kategoriyalar", about: "Brend haqida", sale: "Chegirma",
    hero_subtitle: "Zamonaviy streetwear uslubini tanlang.", view_collection: "Kolleksiyani ko'rish",
    search_placeholder: "Qidirishni boshlang...", type_to_search: "Qidirish uchun yozing", no_results: "Natija topilmadi",
    cart: "Savat", cart_empty: "Savat bo'sh", cart_continue: "Xaridni davom ettirish", cart_total: "Jami", checkout: "Rasmiylashtirish", remove: "O'chirish",
    add_to_cart: "Savatga qo'shish", sizes: "O'lchamlar", colors: "Ranglar", new_label: "YANGI", sale_label: "CHEGIRMA",
    total: "Umumiy", continue_shopping: "Xaridni davom ettirish", quantity: "Miqdor", items: "ta",
    full_name: "To'liq ism", email: "Email", phone: "Telefon", address: "Manzil", city: "Shahar", postal_code: "Pochta indeksi",
    country: "Mamlakat", finland_house: "Uy/Xonadon raqami", finland_floor: "Qavat", finland_door: "Domofon kodi",
    sweden_floor: "Våning (ixtiyoriy)", sweden_door: "Portkod (ixtiyoriy)",
    delivery: "Yetkazib berish", delivery_method: "Yetkazib berish usuli",
    standard_delivery: "Standart yetkazib berish", standard_eta: "20-30 kun, BEPUL",
    standard_eta_se: "7-14 kun, BEPUL",
    express_delivery: "Tezkor yetkazib berish", express_eta: "10-15 kun",
    express_eta_se: "3-5 kun",
    free: "BEPUL",
    payment: "To'lov", card_only: "Faqat karta orqali to'lov", card_number: "Karta raqami", expiry: "Amal muddati (MM/YY)", cvc: "CVC",
    bonus_coins: "Bonus coin ishlatish", place_order: "Buyurtma berish", validation_required: "Majburiy maydon",
    invalid_email: "Email noto'g'ri", invalid_phone: "Telefon noto'g'ri", invalid_card: "Karta noto'g'ri",
    invalid_expiry: "Muddati o'tgan yoki format noto'g'ri", invalid_cvc: "CVC 3-4 raqam bo'lishi kerak",
    back: "Orqaga", back_to_shop: "Do'konga qaytish",
    footer_quote: "TENZA shunchaki kiyim emas. Bu o'zlik.", footer_newsletter: "Yangiliklarga obuna bo'ling",
    footer_rights: "Barcha huquqlar himoyalangan", footer_privacy: "Maxfiylik", footer_terms: "Shartlar",
    return_policy: "Qaytarish muddati: 3 kun",
    hoodie: "Hudie", tshirt: "Futbolka", pants: "Shim", shorts: "Shortik", jacket: "Kurtka", windbreaker: "Vetrovka", sneakers: "Krossovka", accessories: "Aksessuar", limited: "Cheklangan",
    clear: "Tozalash", favorites: "Sevimlilar", loyalty: "Loyalty", program: "dasturi",
    coins: "Coins", your_coins: "Sizning coinlaringiz", discount_info: "Chegirma qiymati",
    apply_discount: "Chegirmani qo'llash", how_it_works: "Qanday ishlaydi", history: "Tarix",
    no_history: "Hali tarix yo'q", per_dollar: "Har $1 uchun", write_review: "Sharh yozish",
    discount_applied: "chegirma qo'llandi", loyalty_desc: "Xarid qiling va coin yig'ing!",
    telegram_title: "Yetkazib berish faqat Finlyandiyaga", telegram_desc: "Sizning mamlakatingizga yetkazib berish mavjud emas. Iltimos, Telegram orqali bog'laning:",
    telegram_btn: "Telegram'da bog'lanish",
    welcome: "Xush kelibsiz", login: "Kirish", register: "Ro'yxatdan o'tish", logout: "Chiqish",
    password: "Parol", confirm_password: "Parolni tasdiqlash", password_mismatch: "Parollar mos kelmaydi",
    referral_code: "Referal kod (ixtiyoriy)", your_referral: "Sizning referal kodingiz",
    thank_you: "Rahmat!", order_confirmed: "Buyurtmangiz tasdiqlandi", order_placed: "Buyurtmangiz qabul qilindi",
    processing: "Qayta ishlanmoqda...", pay: "To'lash",
    data_not_saved: "Karta ma'lumotlari saqlanmaydi",
    standard_shipping: "Standart yetkazib berish", free_shipping: "Bepul yetkazib berish",
    payment_success: "To'lov muvaffaqiyatli!", redirecting: "Yo'naltirilmoqda...",
    card_number_placeholder: "0000 0000 0000 0000", card_name: "Karta egasi", card_name_placeholder: "ISMI FAMILIYASI",
    card_expiry: "Amal muddati", card_expiry_placeholder: "MMYY", card_cvc: "CVC", card_cvc_placeholder: "***",
    support: "Qo'llab-quvvatlash",
    checkout_agree: "Buyurtma berish orqali siz",
  },
  en: {
    home: "Home", new: "New", categories: "Categories", about: "About", sale: "Sale",
    hero_subtitle: "Pick your modern streetwear look.", view_collection: "View collection",
    search_placeholder: "Start searching...", type_to_search: "Type to search", no_results: "No results found",
    cart: "Cart", cart_empty: "Cart is empty", cart_continue: "Continue shopping", cart_total: "Total", checkout: "Checkout", remove: "Remove",
    add_to_cart: "Add to cart", sizes: "Sizes", colors: "Colors", new_label: "NEW", sale_label: "SALE",
    total: "Total", continue_shopping: "Continue shopping", quantity: "Quantity", items: "items",
    full_name: "Full Name", email: "Email", phone: "Phone", address: "Address", city: "City", postal_code: "Postal Code",
    country: "Country", finland_house: "House/Apartment number", finland_floor: "Floor", finland_door: "Door code",
    sweden_floor: "Floor (optional)", sweden_door: "Door code (optional)",
    delivery: "Delivery", delivery_method: "Delivery Method",
    standard_delivery: "Standard Delivery", standard_eta: "20-30 days, FREE",
    standard_eta_se: "7-14 days, FREE",
    express_delivery: "Express Delivery", express_eta: "10-15 days",
    express_eta_se: "3-5 days", free: "FREE",
    payment: "Payment", card_only: "Card payment only", card_number: "Card Number", expiry: "Expiry (MM/YY)", cvc: "CVC",
    bonus_coins: "Use bonus coins", place_order: "Place order", validation_required: "Required field",
    invalid_email: "Invalid email", invalid_phone: "Invalid phone", invalid_card: "Invalid card number",
    invalid_expiry: "Expiry must be in future", invalid_cvc: "CVC must be 3-4 digits",
    back: "Back", back_to_shop: "Back to shop",
    footer_quote: "TENZA is not just clothing. It's identity.", footer_newsletter: "Subscribe to newsletter",
    footer_rights: "All rights reserved", footer_privacy: "Privacy", footer_terms: "Terms",
    return_policy: "Return window: 3 days",
    hoodie: "Hoodie", tshirt: "T-shirts", pants: "Pants", shorts: "Shorts", jacket: "Jackets", windbreaker: "Windbreakers", sneakers: "Sneakers", accessories: "Accessories", limited: "Limited",
    clear: "Clear", favorites: "Favorites", loyalty: "Loyalty", program: "Program",
    coins: "Coins", your_coins: "Your coins", discount_info: "Discount value",
    apply_discount: "Apply discount", how_it_works: "How it works", history: "History",
    no_history: "No history yet", per_dollar: "Per $1 spent", write_review: "Write a review",
    discount_applied: "discount applied", loyalty_desc: "Shop and earn coins!",
    telegram_title: "Delivery only to Finland", telegram_desc: "Delivery is not available in your country. Please contact us via Telegram:",
    telegram_btn: "Contact on Telegram",
    welcome: "Welcome", login: "Login", register: "Register", logout: "Logout",
    password: "Password", confirm_password: "Confirm Password", password_mismatch: "Passwords don't match",
    referral_code: "Referral code (optional)", your_referral: "Your referral code",
    thank_you: "Thank you!", order_confirmed: "Your order is confirmed", order_placed: "Order placed",
    processing: "Processing...", pay: "Pay",
    data_not_saved: "Card details are not saved",
    standard_shipping: "Standard shipping", free_shipping: "Free shipping",
    payment_success: "Payment successful!", redirecting: "Redirecting...",
    card_number_placeholder: "0000 0000 0000 0000", card_name: "Cardholder name", card_name_placeholder: "NAME SURNAME",
    card_expiry: "Expiry date", card_expiry_placeholder: "MMYY", card_cvc: "CVC", card_cvc_placeholder: "***",
    support: "Support",
    checkout_agree: "By placing an order you agree with",
  },
  ru: {
    checkout_agree: "Оформляя заказ вы соглашаетесь с",
    home: "Главная", new: "Новинки", categories: "Категории", about: "О бренде", sale: "Распродажа",
    hero_subtitle: "Выберите современный streetwear образ.", view_collection: "Посмотреть коллекцию",
    search_placeholder: "Начните поиск...", type_to_search: "Печатайте для поиска", no_results: "Ничего не найдено",
    cart: "Корзина", cart_empty: "Корзина пуста", cart_total: "Итого", checkout: "Оформить", remove: "Удалить",
    add_to_cart: "В корзину", sizes: "Размеры", colors: "Цвета", new_label: "НОВИНКА", sale_label: "СКИДКА",
    total: "Итого", continue_shopping: "Продолжить покупки", quantity: "Кол-во", items: "шт",
    full_name: "Полное имя", email: "Email", phone: "Телефон", address: "Адрес", city: "Город", postal_code: "Почтовый индекс",
    country: "Страна", finland_house: "Номер дома/квартиры", finland_floor: "Этаж", finland_door: "Код двери",
    sweden_floor: "Этаж (необяз.)", sweden_door: "Код двери (необяз.)",
    delivery: "Доставка", standard_delivery: "Стандартная доставка", standard_eta: "20-30 дней, БЕСПЛАТНО",
    standard_eta_se: "7-14 дн, БЕСПЛАТНО",
    express_delivery: "Экспресс доставка", express_eta: "10-15 дней",
    express_eta_se: "3-5 дн",
    payment: "Оплата", card_only: "Только картой", card_number: "Номер карты", expiry: "Срок (MM/YY)", cvc: "CVC",
    bonus_coins: "Использовать бонусы", place_order: "Оформить заказ", validation_required: "Обязательное поле",
    invalid_email: "Неверный email", invalid_phone: "Неверный телефон", invalid_card: "Неверный номер карты",
    invalid_expiry: "Срок истёк или неверный формат", invalid_cvc: "CVC должен быть 3-4 цифры",
    footer_quote: "TENZA — это не просто одежда. Это идентичность.", footer_newsletter: "Подпишитесь на рассылку",
    footer_rights: "Все права защищены", footer_privacy: "Конфиденциальность", footer_terms: "Условия",
    return_policy: "Возврат: 3 дня",
    hoodie: "Худи", tshirt: "Футболки", pants: "Штаны", shorts: "Шорты", jacket: "Куртки", windbreaker: "Ветровки", sneakers: "Кроссовки", accessories: "Аксессуары", limited: "Лимитированное",
    clear: "Очистить", favorites: "Избранное",
    support: "Поддержка",
    cart_continue: "Продолжить покупки", free: "БЕСПЛАТНО", delivery_method: "Способ доставки", back_to_shop: "В магазин", back: "Назад",
    loyalty: "Лояльность", program: "Программа", coins: "Монеты", your_coins: "Ваши монеты",
    discount_info: "Сумма скидки", apply_discount: "Применить скидку", how_it_works: "Как это работает",
    history: "История", no_history: "Истории пока нет", per_dollar: "За каждый ", write_review: "Написать отзыв",
    discount_applied: "скидка применена", loyalty_desc: "Покупайте и зарабатывайте монеты!",
    telegram_title: "Доставка только в Финляндию", telegram_desc: "Доставка в вашу страну недоступна. Пожалуйста, свяжитесь с нами через Telegram:",
    telegram_btn: "Связаться в Telegram", welcome: "Добро пожаловать", login: "Войти", register: "Регистрация",
    logout: "Выйти", password: "Пароль", confirm_password: "Подтвердите пароль", password_mismatch: "Пароли не совпадают",
    referral_code: "Реферальный код (необязательно)", your_referral: "Ваш реферальный код",
    thank_you: "Спасибо!", order_confirmed: "Ваш заказ подтверждён", order_placed: "Заказ размещён",
    processing: "Обработка...", pay: "Оплатить", data_not_saved: "Данные карты не сохраняются",
    standard_shipping: "Стандартная доставка", free_shipping: "Бесплатная доставка",
    payment_success: "Оплата успешна!", redirecting: "Перенаправление...",
    card_number_placeholder: "0000 0000 0000 0000", card_name: "Владелец карты", card_name_placeholder: "ИМЯ ФАМИЛИЯ",
    card_expiry: "Срок действия", card_expiry_placeholder: "ММГГ", card_cvc: "CVC", card_cvc_placeholder: "***",
  },
  fi: {
    checkout_agree: "Tilaamalla hyväksyt",
    home: "Etusivu", new: "Uutta", categories: "Kategoriat", about: "Brändistä", sale: "Ale",
    hero_subtitle: "Valitse moderni streetwear-look.", view_collection: "Katso kokoelmaa",
    search_placeholder: "Aloita haku...", type_to_search: "Kirjoita hakeaksesi", no_results: "Ei tuloksia",
    cart: "Ostoskori", cart_empty: "Ostoskori on tyhjä", cart_total: "Yhteensä", checkout: "Kassalle", remove: "Poista",
    add_to_cart: "Lisää ostoskoriin", sizes: "Koot", colors: "Värit", new_label: "UUTTA", sale_label: "ALE",
    total: "Yhteensä", continue_shopping: "Jatka ostoksia", quantity: "Määrä", items: "kpl",
    full_name: "Koko nimi", email: "Sähköposti", phone: "Puhelin", address: "Osoite", city: "Kaupunki", postal_code: "Postinumero",
    country: "Maa", finland_house: "Talon/asunnon numero", finland_floor: "Kerros", finland_door: "Ovikoodi",
    sweden_floor: "Kerros (valinnainen)", sweden_door: "Ovikoodi (valinnainen)",
    delivery: "Toimitus", standard_delivery: "Standard-toimitus", standard_eta: "20-30 pv, ILMAINEN",
    standard_eta_se: "7-14 pv, ILMAINEN",
    express_delivery: "Express-toimitus", express_eta: "10-15 pv",
    express_eta_se: "3-5 pv",
    payment: "Maksu", card_only: "Vain kortilla", card_number: "Kortin numero", expiry: "Voimassaolo (MM/VV)", cvc: "CVC",
    bonus_coins: "Käytä bonuskolikoita", place_order: "Tee tilaus", validation_required: "Pakollinen kenttä",
    invalid_email: "Virheellinen sähköposti", invalid_phone: "Virheellinen puhelin", invalid_card: "Virheellinen kortin numero",
    invalid_expiry: "Vanhentunut tai virheellinen", invalid_cvc: "CVC tulee olla 3-4 numeroa",
    footer_quote: "TENZA ei ole vain vaatteita. Se on identiteetti.", footer_newsletter: "Tilaa uutiskirje",
    footer_rights: "Kaikki oikeudet pidätetään", footer_privacy: "Tietosuojelu", footer_terms: "Ehdot",
    return_policy: "Palautus: 3 päivää",
    hoodie: "Huppari", tshirt: "T-paidat", pants: "Housut", shorts: "Shortit", jacket: "Takit", windbreaker: "Tuulitakit", sneakers: "Kengät", accessories: "Aksessuarit", limited: "Rajoitettu",
    clear: "Tyhjennä", favorites: "Suosikit",
    support: "Tuki",
    cart_continue: "Jatka ostoksia", free: "ILMAINEN", delivery_method: "Toimitustapa", back_to_shop: "Takaisin kauppaan", back: "Takaisin",
    loyalty: "Kanta-asiakkuus", program: "Ohjelma", coins: "Kolikot", your_coins: "Kolikkosi",
    discount_info: "Alennuksen arvo", apply_discount: "Käytä alennus", how_it_works: "Miten se toimii",
    history: "Historia", no_history: "Ei historiaa vielä", per_dollar: "Per ", write_review: "Kirjoita arvostelu",
    discount_applied: "alennus käytetty", loyalty_desc: "Osta ja ansaitse kolikoita!",
    telegram_title: "Toimitus vain Suomeen", telegram_desc: "Toimitusta maahasi ei ole saatavilla. Ota yhteyttä Telegramin kautta:",
    telegram_btn: "Ota yhteyttä Telegramissa", welcome: "Tervetuloa", login: "Kirjaudu", register: "Rekisteröidy",
    logout: "Kirjaudu ulos", password: "Salasana", confirm_password: "Vahvista salasana", password_mismatch: "Salasanat eivät täsmää",
    referral_code: "Kutsukoodi (valinnainen)", your_referral: "Kutsukoodisi",
    thank_you: "Kiitos!", order_confirmed: "Tilauksesi on vahvistettu", order_placed: "Tilaus lähetetty",
    processing: "Käsitellään...", pay: "Maksa", data_not_saved: "Korttitietoja ei tallenneta",
    standard_shipping: "Vakiotoimitus", free_shipping: "Ilmainen toimitus",
    payment_success: "Maksu onnistui!", redirecting: "Uudelleenohjataan...",
    card_number_placeholder: "0000 0000 0000 0000", card_name: "Kortinhaltija", card_name_placeholder: "NIMI SURNAME",
    card_expiry: "Voimassaoloaika", card_expiry_placeholder: "KKVV", card_cvc: "CVC", card_cvc_placeholder: "***",
  },
  sv: {
    checkout_agree: "Genom att lägga en beställning godkänner du",
    home: "Hem", new: "Nytt", categories: "Kategorier", about: "Om varumärket", sale: "Rea",
    hero_subtitle: "Välj din moderna streetwear-look.", view_collection: "Se kollektionen",
    search_placeholder: "Börja sök...", type_to_search: "Skriv för att söka", no_results: "Inga resultat",
    cart: "Varukorg", cart_empty: "Varukorgen är tom", cart_total: "Totalt", checkout: "Till kassan", remove: "Ta bort",
    add_to_cart: "Lägg i varukorgen", sizes: "Storlekar", colors: "Färger", new_label: "NYTT", sale_label: "REA",
    total: "Totalt", continue_shopping: "Fortsätt handla", quantity: "Antal", items: "st",
    full_name: "Fullständigt namn", email: "E-post", phone: "Telefon", address: "Adress", city: "Stad", postal_code: "Postnummer",
    country: "Land", finland_house: "Hus/lägenhetsnummer", finland_floor: "Våning", finland_door: "Dörrkod",
    sweden_floor: "Våning (valfritt)", sweden_door: "Portkod (valfritt)",
    delivery: "Leverans", standard_delivery: "Standard leverans", standard_eta: "20-30 dagar, GRATIS",
    standard_eta_se: "7-14 dagar, GRATIS",
    express_delivery: "Express leverans", express_eta: "10-15 dagar",
    express_eta_se: "3-5 dagar",
    payment: "Betaling", card_only: "Endast med kort", card_number: "Kortnummer", expiry: "Giltigt till (MM/ÅÅ)", cvc: "CVC",
    bonus_coins: "Använd bonusmynt", place_order: "Lägg beställning", validation_required: "Obligatoriskt fält",
    invalid_email: "Ogiltig e-post", invalid_phone: "Ogiltig telefon", invalid_card: "Ogiltigt kortnummer",
    invalid_expiry: "Utgånget eller ogiltigt format", invalid_cvc: "CVC måste vara 3-4 siffror",
    footer_quote: "TENZA är inte bara kläder. Det är identitet.", footer_newsletter: "Prenumerera på nyhetsbrev",
    footer_rights: "Alla rättigheter förbehålls", footer_privacy: "Sekretess", footer_terms: "Villkor",
    return_policy: "Retur: 3 dagar",
    hoodie: "Hoodie", tshirt: "T-tröjor", pants: "Byxor", shorts: "Shorts", jacket: "Jackor", windbreaker: "Vindjackor", sneakers: "Sneakers", accessories: "Accessoarer", limited: "Begränsad",
    clear: "Rensa", favorites: "Favoriter",
    support: "Support",
    cart_continue: "Fortsätt handla", free: "GRATIS", delivery_method: "Leveransmetod", back_to_shop: "Tillbaka till butiken", back: "Tillbaka",
    loyalty: "Lojalitet", program: "Program", coins: "Mynt", your_coins: "Dina mynt",
    discount_info: "Rabattvärde", apply_discount: "Tillämpa rabatt", how_it_works: "Hur det fungerar",
    history: "Historik", no_history: "Ingen historik än", per_dollar: "Per ", write_review: "Skriv recension",
    discount_applied: "rabatt tillämpad", loyalty_desc: "Handla och tjäna mynt!",
    telegram_title: "Leverans endast till Finland", telegram_desc: "Leverans till ditt land är inte tillgänglig. Kontakta oss via Telegram:",
    telegram_btn: "Kontakta på Telegram", welcome: "Välkommen", login: "Logga in", register: "Registrera",
    logout: "Logga ut", password: "Lösenord", confirm_password: "Bekräfta lösenord", password_mismatch: "Lösenorden matchar inte",
    referral_code: "Referenskod (valfritt)", your_referral: "Din referenskod",
    thank_you: "Tack!", order_confirmed: "Din beställning är bekräftad", order_placed: "Beställning gjord",
    processing: "Bearbetar...", pay: "Betala", data_not_saved: "Kortuppgifter sparas inte",
    standard_shipping: "Standardleverans", free_shipping: "Fri frakt",
    payment_success: "Betalning lyckades!", redirecting: "Omdirigerar...",
    card_number_placeholder: "0000 0000 0000 0000", card_name: "Kortinnehavare", card_name_placeholder: "NAMN EFTERNAMN",
    card_expiry: "Giltighetstid", card_expiry_placeholder: "MMÅÅ", card_cvc: "CVC", card_cvc_placeholder: "***",
  },
}

const currencies = {
  uz: { code: 'UZS', locale: 'uz-UZ' },
  ru: { code: 'RUB', locale: 'ru-RU' },
  en: { code: 'USD', locale: 'en-US' },
  fi: { code: 'EUR', locale: 'fi-FI' },
  sv: { code: 'SEK', locale: 'sv-SE' },
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('fi')

  useEffect(() => {
    const saved = localStorage.getItem('tenza_locale')
    if (saved && translations[saved]) setLocaleState(saved)
  }, [])

  const setLocale = (newLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('tenza_locale', newLocale)
  }

  const t = (key) => translations[locale]?.[key] || translations.en[key] || key

  const rates = {
    uz: 10000,
    ru: 90,
    en: 1,
    fi: 0.95,
    sv: 10.5,
  }

  const formatPrice = (amount) => {
    const curr = currencies[locale] || currencies.en
    const rate = rates[locale] || 1
    const value = Number(amount || 0) * rate
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      minimumFractionDigits: curr.code === 'UZS' ? 0 : 0,
      maximumFractionDigits: curr.code === 'UZS' && value >= 100 ? 0 : 2,
    }).format(value)
  }

  const coinValues = {
    uz: '100 coin = 5,000 UZS',
    ru: '100 coin = 45 RUB',
    en: '100 coin = $0.50',
    fi: '100 coin = 0.50 EUR',
    sv: '100 coin = 5.5 SEK',
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatPrice, currency: currencies[locale], locales, coinRate: 100, coinValue: coinValues[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}

export const supportedLocales = locales