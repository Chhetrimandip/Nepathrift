"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { productsService, Product } from "@/lib/services/products"
import Link from "next/link"

export default function ProductPage() {
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

        // Fetch similar products (same category)
        const allProducts = await productsService.getAll()
        const similar = allProducts
          .filter(p => 
            p.category === productData.category && 
            p.id !== productData.id
          )
          .slice(0, 4)
        setSimilarProducts(similar)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
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

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-purple-600 mb-4">${product.price.toFixed(2)}</p>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600">{product.description}</p>
            <p><span className="font-semibold">Condition:</span> {product.condition}</p>
            <p><span className="font-semibold">Brand:</span> {product.brand}</p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Size</option>
              <option value={product.size}>{product.size}</option>
            </select>
          </div>

          <div className="space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold 
                hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <Link
              href={`/checkout?productId=${product.id}`}
              className="border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-full 
                font-semibold hover:bg-purple-600 hover:text-white transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
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