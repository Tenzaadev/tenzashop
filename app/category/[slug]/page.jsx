'use client'
import { useParams } from 'next/navigation'
import Header from '../../components/Header'
import ProductGrid from '../../components/ProductGrid'

export default function CategoryPage() {
  const { slug } = useParams()
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductGrid category={slug} />
      </main>
    </>
  )
}
