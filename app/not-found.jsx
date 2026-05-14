import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">Sahifa topilmadi</p>
        <Link href="/" className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-xl">
          Bosh sahifaga
        </Link>
      </div>
    </div>
  )
}
