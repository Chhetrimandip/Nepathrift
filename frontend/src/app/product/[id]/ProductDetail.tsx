"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { productsService } from "@/lib/services/products"
import { reviewsService } from "@/lib/services/reviews"
import { commentsService } from "@/lib/services/comments"
import { sellersService } from "@/lib/services/sellers"
import SellerReview from "@/app/components/SellerReview"
import ProductComment from "@/app/components/ProductComment"
import { Playfair_Display, Poppins } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [reviews, setReviews] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load product
        const productData = await productsService.getProduct(id as string)
        if (!productData) {
          setError("Product not found")
          return
        }
        setProduct(productData)

        // Load seller
        const sellerData = await sellersService.getSeller(productData.sellerId)
        setSeller(sellerData)

        // Load reviews and comments
        const [sellerReviews, productComments] = await Promise.all([
          reviewsService.getSellerReviews(productData.sellerId),
          commentsService.getProductComments(id as string)
        ])
        
        setReviews(sellerReviews)
        setComments(productComments)
      } catch (error) {
        console.error("Error loading product:", error)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrls[0],
      quantity: 1,
      sellerId: product.sellerId
    });
  };

  const handleReviewSubmit = async (review: { rating: number; comment: string }) => {
    if (!product || !user) return
    const newReview = await reviewsService.create(product.sellerId, review)
    setReviews(prev => [newReview, ...prev])
  }

  const handleCommentSubmit = async (comment: string) => {
    if (!product || !user) return
    const newComment = await commentsService.create(product.id, comment)
    setComments(prev => [newComment, ...prev])
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsService.delete(product.sellerId, reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Product not found"}</p>
      </div>
    )
  }

  return (
    <div className={`${poppins.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <Image
              src={product.imageUrls[selectedImage]}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover rounded-lg"
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((url: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 relative rounded-lg overflow-hidden 
                    ${selectedImage === index ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className={`${playfair.className} text-3xl font-bold`}>
              {product.name}
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Rs {product.price.toFixed(2)}
            </h3>
            
            <div className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-semibold">Condition:</span> {product.condition}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              {product.brand && (
                <p><span className="font-semibold">Brand:</span> {product.brand}</p>
              )}
              {product.size && (
                <p><span className="font-semibold">Size:</span> {product.size}</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-8 w-full bg-purple-600 text-white py-3 px-6 rounded-md 
                hover:bg-purple-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Seller Info and Reviews */}
          {seller && (
            <div className="border-t pt-8">
              <h2 className={`${playfair.className} text-xl font-bold mb-4`}>
                Seller Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{seller.name}</p>
              
              <div className="mt-6">
                <SellerReview 
                  sellerId={product.sellerId} 
                  reviews={reviews}
                  onSubmit={handleReviewSubmit}
                  onDelete={handleDeleteReview}
                />
              </div>

              {reviews.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Seller Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-t py-4">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{review.rating}</span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Product Comments */}
          <div className="border-t pt-8">
            <h2 className={`${playfair.className} text-xl font-bold mb-4`}>
              Comments
            </h2>
            <ProductComment
              productId={product.id}
              onSubmit={handleCommentSubmit}
              comments={comments}
            />
          </div>
        </div>
      </div>
    </div>
  )
}