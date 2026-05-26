'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Check, Copy, ExternalLink, Database, Key, Globe, Shield, Upload, Loader } from 'lucide-react'
import { useState } from 'react'

const steps = [
  {
    icon: Globe,
    title: '1. Firebase Console',
    desc: 'Go to https://console.firebase.google.com and click "Create project". Name it "tenza-shop".',
    link: 'https://console.firebase.google.com',
    linkText: 'console.firebase.google.com',
  },
  {
    icon: Database,
    title: '2. Firestore Database',
    desc: 'In the sidebar select "Firestore Database" -> "Create database". Choose a region and start in test mode.',
  },
  {
    icon: Key,
    title: '3. Get config',
    desc: 'Click the gear icon next to "Project Overview" -> "Project settings" -> scroll to "Your apps" -> select "Web" (</>). Copy the firebaseConfig object.',
  },
  {
    icon: Shield,
    title: '4. Fill .env.local',
    desc: 'Open .env.local in the project root and replace with your copied config values:',
    code: `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tenza-shop.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tenza-shop
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tenza-shop.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123`,
  },
  {
    icon: Check,
    title: '5. Restart server',
    desc: 'Stop the dev-server (Ctrl+C) and start again:',
    code: 'npm run dev',
  },
  {
    icon: Upload,
    title: '6. Seed products to Firestore',
    desc: 'Upload the initial 30 products from localStorage to Firestore. Do this once after Firebase is connected.',
  },
]

export default function FirebaseSetupPage() {
  const [copied, setCopied] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState(null)

  const handleSeed = async () => {
    setSeeding(true)
    setSeedResult(null)
    try {
      const { seedProducts } = await import('@/lib/firestore')
      const { defaultProducts } = await import('@/data/productStore')
      const result = await seedProducts(defaultProducts)
      setSeedResult(result)
    } catch (e) {
      setSeedResult({ error: e.message })
    }
    setSeeding(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-10">
        <Link href="/admin/settings" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Firebase sozlamalari
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Firebase Setup</h1>
          <p className="text-gray-400 text-sm">Follow the steps below to connect Firebase to Tenza Shop.</p>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <step.icon size={20} className="text-[#ccff00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  {step.link && (
                    <a href={step.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#ccff00] text-sm mt-2 hover:underline">
                      {step.linkText} <ExternalLink size={12} />
                    </a>
                  )}
                  {step.code && (
                    <div className="relative mt-3">
                      <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-mono text-[#ccff00] overflow-x-auto whitespace-pre-wrap">{step.code}</pre>
                      {i === 3 && (
                        <button onClick={() => { navigator.clipboard.writeText(steps[3].code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                          className="absolute top-2 right-2 p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  )}
                  {i === 5 && (
                    <div className="mt-3">
                      <button
                        onClick={handleSeed}
                        disabled={seeding || (seedResult?.seeded)}
                        className="px-5 py-2.5 bg-[#ccff00] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all disabled:opacity-40 flex items-center gap-2 text-sm"
                      >
                        {seeding ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                        {seeding ? 'Seeding...' : seedResult?.seeded ? 'Seeded!' : seedResult?.skipped ? `${seedResult.count} products exist` : 'Seed initial products'}
                      </button>
                      {seedResult?.error && (
                        <p className="text-red-400 text-xs mt-2">Error: {seedResult.error}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mt-6">
          <p className="text-yellow-400 text-sm">
            After filling .env.local restart the dev-server. Firebase runs alongside localStorage with fallback for offline use.
          </p>
        </div>
      </main>
    </div>
  )
}
