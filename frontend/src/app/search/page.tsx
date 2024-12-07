'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { searchService } from '@/lib/services/search'
import { Product } from '@/lib/services/products'
import Link from 'next/link'
import Image from 'next/image'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase-client'

function SearchContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      try {
        const results = await searchService.searchProducts(query)
        setProducts(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [query])

  if (loading) {
    return <div>Searching...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {product.imageUrls?.[0] && (
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}