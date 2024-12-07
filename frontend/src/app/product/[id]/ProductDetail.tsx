"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { productsService, Product } from "@/lib/services/products"
import Link from "next/link"
import { Playfair_Display, Poppins } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

export default function ProductDetail(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [selectedSize, setSelectedSize] = useState("")
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productsService.getById(params.id as string)
        setProduct(productData)

        if (productData) {
          const allProducts = await productsService.getAll()
          const similar = allProducts
            .filter(p => 
              p.category === productData.category && 
              p.id !== productData.id
            )
            .slice(0, 4)
          setSimilarProducts(similar)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id: product.id!,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      imageUrl: product.imageUrls[0]
    })
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/shop" className="text-purple-600 hover:text-purple-800">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrls[mainImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((url, index) => (
                <button
                  key={url}
                  onClick={() => setMainImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 
                    ${mainImage === index ? 'border-purple-600' : 'border-transparent'}`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className={`${playfair.className} text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100`}>
            {product.name}
          </h1>
          <p className={`${poppins.className} text-2xl text-purple-600 mb-4`}>
            ${product.price.toFixed(2)}
          </p>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            <p className={`${poppins.className}`}>
              <span className="font-semibold">Condition:</span> {product.condition}
            </p>
            <p className={`${poppins.className}`}>
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
          </div>

          <div className="mb-6">
            <h3 className={`${poppins.className} font-semibold mb-2`}>Select Size</h3>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              required
            >
              <option value="" className="text-gray-500 dark:text-gray-400">Select Size</option>
              <option value={product.size} className="text-gray-800 dark:text-gray-200">{product.size}</option>
            </select>
          </div>

          <div className="space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`${poppins.className} bg-purple-600 text-white px-6 py-2 rounded-full font-semibold 
                hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add to Cart
            </button>
            <Link
              href={`/checkout?productId=${product.id}`}
              className={`${poppins.className} border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-full 
                font-semibold hover:bg-purple-600 hover:text-white transition-colors`}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Similar Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{product.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 