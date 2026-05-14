'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Target, Heart, Users, Star } from 'lucide-react'
import { useI18n } from '@/i18n'
import Header from '../components/Header'

export default function AboutPage() {
  const { t, locale } = useI18n()

  const translations = {
    back: { uz: 'Bosh sahifaga', ru: 'На главную', en: 'Back to home', fi: 'Takaisin', sv: 'Tillbaka' },
    title: { uz: "Brend haqida", ru: "О бренде", en: "About brand", fi: "Tietoa merkistä", sv: "Om varumärket" },
    subtitle: { uz: "Kiyim emas. Bu tarix, ishtiyoq va orzu.", ru: "Не просто одежда. Это история, страсть и мечта.", en: "Not just clothing. It's history, passion and dream.", fi: "Ei vain vaatteita. Se on historiaa, intohimoa ja unelma.", sv: "Inte bara kläder. Det är historia, passion och dröm." },
    myStory: { uz: "Mening hikoyam", ru: "Моя история", en: "My story", fi: "Tarunani", sv: "Min historia" },
    hi: { uz: "Mening ismim", ru: "Меня зовут", en: "My name is", fi: "Nimeni on", sv: "Jag heter" },
    name: { uz: "Jamshid", ru: "Jamshid", en: "Jamshid", fi: "Jamshid", sv: "Jamshid" },
    story1: { uz: "Men 2026 yilda maktabni bitirdim. Ko'p odamlar maktabdan keyin nima qilishni bilmaydi. Men ham bilmasdim. Lekin bir narsani aniq tushundim: agar hayot senga imkoniyat bermasa — uni o'zing yarat. Shunday qilib TENZA tug'ildi.", ru: "Я закончил школу в 2026 году. Многие не знают, что делать после школы. Я тоже не знал. Но я чётко понял одно: если жизнь не даёт тебе шанс — создай его сам. Так родился TENZA.", en: "I graduated high school in 2026. Many people don't know what to do after school. I didn't either. But I clearly understood one thing: if life doesn't give you a chance — create it yourself. That's how TENZA was born.", fi: "Valmistuin lukiosta vuonna 2026. Moni ei tiedä mitä tehdä koulun jälkeen. En tiennyt minäkään. Mutta ymmärsin yhden asian selvästi: jos elämä ei anna sinulle mahdollisuutta — luo se itse. Näin TENZA syntyi.", sv: "Jag tog examen från gymnasiet 2026. Många vet inte vad de ska göra efter skolan. Det visste inte jag heller. Men jag förstod en sak tydligt: om livet inte ger dig en chans — skapa den själv. Så föddes TENZA." },
    story2: { uz: "Bu brend mening shaxsiy e'tirozim. Zero, ko'plab brendlar foyda uchun sifatni qurbon qiladi. Ular 'arzon' deb atalgan narsani sotishadi — va bu narsa bir necha yuvishdan keyin o'z shaklini yo'qotadi. Men boshqacha yo'l tanladim.", ru: "Этот бренд — моё личное заявление. Многие бренды жертвуют качеством ради прибыли. Они продают то, что называют «дёшево» — и эта вещь теряет форму после нескольких стирок. Я выбрал другой путь.", en: "This brand is my personal statement. Many brands sacrifice quality for profit. They sell what is called 'cheap' — and that item loses its shape after a few washes. I chose a different path.", fi: "Tämä brändi on henkilökohtainen julistukseni. Monet merkit uhraavat laadun voiton vuoksi. He myyvät mitä kutsutaan 'halvaksi' — ja se menettää muotonsa muutaman pesun jälkeen. Valitsin toisen tien.", sv: "Detta varumärke är min personliga förklaring. Många märken offrar kvalitet för vinst. De säljer det som kallas 'billigt' — och det tappar formen efter några tvättar. Jag valde en annan väg." },
    story3: { uz: "TENZA'ning har bir mahsuloti — bu sifat va uslub o'rtasidagi murosasiz kelishuv. Men dunyoning eng yaxshi brendlari bilan raqobatlasha oladigan kiyimlar yaratdim — va ularni hammabop narxda taklif qildim. Chunki men ishonaman: yaxshi kiyim faqat boylar uchun emas. Yaxshi kiyim — o'zini hurmat qiladigan har bir inson uchun.", ru: "Каждый продукт TENZA — это бескомпромиссный союз качества и стиля. Я создал одежду, которая может конкурировать с лучшими мировыми брендами — и предложил её по доступной цене. Потому что я верю: хорошая одежда не только для богатых. Хорошая одежда — для каждого, кто уважает себя.", en: "Every TENZA product is an uncompromising union of quality and style. I created clothes that can compete with the world's best brands — and offered them at an affordable price. Because I believe: good clothing is not just for the rich. Good clothing is for everyone who respects themselves.", fi: "Jokainen TENZA-tuote on laadun ja tyylin ehdoton liitto. Loin vaatteita, jotka voivat kilpailla maailman parhaiden merkkien kanssa — ja tarjosin ne kohtuuhintaan. Koska uskon: hyvät vaatteet eivät ole vain rikkaille. Hyvät vaatteet ovat jokaiselle, joka kunnioittaa itseään.", sv: "Varje TENZA-produkt är en kompromisslös förening av kvalitet och stil. Jag skapade kläder som kan konkurrera med världens bästa märken — och erbjöd dem till ett överkomligt pris. För jag tror: bra kläder är inte bara för de rika. Bra kläder är för alla som respekterar sig själva." },
    story4: { uz: "TENZA — bu faqat kiyim emas. Bu — harakat. Bu — o'z hayotingni o'z qo'lingga olish. Bu — 'men qila olaman' degan gapning isboti. Xush kelibsiz. Bu — mening hikoyam. Lekin u sening hikoyangga aylanishi mumkin.", ru: "TENZA — это не просто одежда. Это — движение. Это — взять свою жизнь в свои руки. Это — доказательство того, что ты можешь. Добро пожаловать. Это — моя история. Но она может стать твоей.", en: "TENZA is not just clothing. It's a movement. It's taking your life into your own hands. It's proof that you can do it. Welcome. This is my story. But it can become yours.", fi: "TENZA ei ole vain vaatteita. Se on liike. Se on elämäsi ottamista omiin käsiisi. Se on todiste siitä, että pystyt siihen. Tervetuloa. Tämä on minun tarinani. Mutta se voi tulla sinun tarinaksesi.", sv: "TENZA är inte bara kläder. Det är en rörelse. Det är att ta ditt liv i egna händer. Det är beviset på att du kan. Välkommen. Det här är min historia. Men den kan bli din." },
    founder: { uz: "— Jamshid, TENZA asoschisi", ru: "— Jamshid, основатель TENZA", en: "— Jamshid, founder of TENZA", fi: "— Jamshid, TENZAn perustaja", sv: "— Jamshid, grundare av TENZA" },
    quality: { uz: "Sifat", ru: "Качество", en: "Quality", fi: "Laatu", sv: "Kvalitet" },
    qualityText: { uz: "Har bir narsa qattiq nazoratdan o'tadi. Men shaxsan materiallarni va tikuvni tekshiraman, chunki har bir mahsulotda mening ismim turadi.", ru: "Каждая вещь проходит строгий контроль. Я лично проверяю материалы и пошив, потому что моё имя стоит за каждым товаром.", en: "Everything passes strict control. I personally check materials and sewing because my name is on every product.", fi: "Kaikki käy läpi tiukan tarkistuksen. Tarkistan henkilökohtaisesti materiaalit ja ompelun, koska nimeni on jokaisessa tuotteessa.", sv: "Allt går genom strikt kontroll. Jag kontrollerar personligen material och sömnad eftersom mitt namn står på varje produkt." },
    style: { uz: "Stil", ru: "Стиль", en: "Style", fi: "Tyyli", sv: "Stil" },
    styleText: { uz: "Men jahon trendlarini kuzataman va bugun va ertangi kun uchun mos kiyim yaratanman. Zamonaviy dizayn zamonaviy odamlar uchun.", ru: "Я слежу за мировыми трендами и создаю одежду, которая актуальна сегодня и будет актуальна завтра. Современный дизайн для современных людей.", en: "I follow global trends and create clothing that's relevant today and will be relevant tomorrow. Modern design for modern people.", fi: "Seuraan globaaleja trendejä ja luovan vaatteita, jotka ovat ajankohtaisia tänään ja huomenna. Moderne design moderneille ihmisille.", sv: "Jag följer globala trender och skapar kläder som är relevanta idag och imorgon. Modern design för moderna människor." },
    support: { uz: "Qo'llab-quvvatlash", ru: "Поддержка", en: "Support", fi: "Tuki", sv: "Stöd" },
    supportText: { uz: "TENZA sotib olsang - sen katta biznesni emas, balki modani o'zgartirmoqchi bo'lgan yosh yigitning orzusun qo'llab-quvvatlashtirasan.", ru: "Когда ты покупаешь TENZA — ты поддерживаешь не большой бизнес, а мечту молодого парня, который хочет изменить мир моды.", en: "When you buy TENZA — you're not supporting a big business, but a young guy's dream who wants to change the fashion world.", fi: "Kun ostat TENZA — et tu suurta yritystä, vaan nuoren miehen unelmaa, joka haluaa muuttaa muotimaailman.", sv: "När du köper TENZA — stöder du inte ett stort företag, utan en ung killes dröm som vill förändra-modevärlden." },
    ctaTitle: { uz: "Yosh brendni qo'llab-quvvatla!", ru: "Поддержи молодой бренд!", en: "Support a young brand!", fi: "Tue nuorekka merkkiä!", sv: "Stöd ett ungt märke!" },
    ctaText: { uz: "Har bir xarid - mening orzugqa qadam. TENZA ga ishonganingiz uchun rahmat. Birga biz faqat kiyim emas, balki butun harakatni yaratamiz.", ru: "Каждая покупка — это шаг к моей мечте. Спасибо, что верите в TENZA. Вместе мы создаём не просто одежду, а целое движение.", en: "Every purchase is a step towards my dream. Thank you for believing in TENZA. Together we create not just clothing, but a whole movement.", fi: "Jokainen osto on askel unelmani suuntaan. Kiitos, että uskot TENZA:han. Yhdessä emme luo vain vaatteita, vaan kokonaisen liikkeen.", sv: "Köpet är ett steg mot min dröm. Tack för att du tror på TENZA. Tillsammans skapar vi inte bara kläder, utan en hel rörelse." },
    viewCollection: { uz: "Kolleksiyani ko'rish", ru: "Смотреть коллекцию", en: "View collection", fi: "Katso kokoelma", sv: "Visa kollektion" },
  }

  const tr = (key) => translations[key]?.[locale] || translations[key]?.en || key

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">{tr('back')}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {tr('title')} <span className="text-[#ccff00]">TENZA</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {tr('subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={28} className="text-[#ccff00]" />
              <h2 className="text-2xl font-bold text-white">{tr('myStory')}</h2>
            </div>
            <div className="space-y-4 text-gray-400 leading-relaxed text-lg">
              <p>
                {tr('hi')} <span className="text-white font-semibold">{tr('name')}</span>, {tr('story1')}
              </p>
              <p>
                <span className="text-[#ccff00] font-bold">TENZA</span> {tr('story2')}
              </p>
              <p>
                {tr('story3')}
              </p>
              <p className="text-gray-300 italic pt-4 border-t border-white/5">
                {tr('story4')}
              </p>
              <p className="text-[#ccff00] font-semibold text-right pt-2">
                {tr('founder')}
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Target, title: tr('quality'), text: tr('qualityText') },
              { icon: Heart, title: tr('style'), text: tr('styleText') },
              { icon: Users, title: tr('support'), text: tr('supportText') },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center hover:border-[#ccff00]/20 transition-all"
              >
                <item.icon size={32} className="text-[#ccff00] mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center bg-gradient-to-r from-[#ccff00]/10 via-[#ccff00]/5 to-transparent border border-[#ccff00]/20 rounded-3xl p-10"
          >
            <Star size={40} className="text-[#ccff00] mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-4">{tr('ctaTitle')}</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              {tr('ctaText')}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#ccff00] text-black font-bold rounded-full hover:bg-white transition-all text-lg"
            >
              {tr('viewCollection')}
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}