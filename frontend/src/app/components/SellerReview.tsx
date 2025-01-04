"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Rating } from './Rating'
import { reviewsService } from '@/lib/services/reviews'

interface SellerReviewProps {
  sellerId: string
  reviews: any[]
  onSubmit: (review: {
    rating: number
    comment: string
  }) => Promise<void>
  onDelete: (reviewId: string) => Promise<void>
}

export default function SellerReview({ sellerId, reviews, onSubmit, onDelete }: SellerReviewProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSubmitting(true)
    setError('')
    
    try {
      await onSubmit({
        rating,
        comment
      })
      setRating(0)
      setComment('')
    } catch (error) {
      setError('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <Rating value={rating} onChange={setRating} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900 sm:text-sm"
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting || !rating}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="mt-4">
        <h3 className="font-medium mb-4">Reviews</h3>
        {reviews.map((review) => (
          <div key={review.id} className="border-t py-4">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{review.rating}</span>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
            <button
              onClick={() => onDelete(review.id)}
              className="text-red-500 hover:text-red-700 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 