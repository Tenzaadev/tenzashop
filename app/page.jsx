'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'

function HomeContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  return (
    <main>
      <Hero />
      <ProductGrid category={category} />
    </main>
  )
}

export default function HomePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<main><Hero /></main>}>
        <HomeContent />
      </Suspense>
    </>
  )
}