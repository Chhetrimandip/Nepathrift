"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface ProductCommentProps {
  productId: string
  onSubmit: (comment: string) => Promise<void>
  comments: Array<{
    id: string
    userId: string
    userPhoto?: string
    userName: string
    comment: string
    createdAt: Date
  }>
}

export default function ProductComment({ productId, onSubmit, comments }: ProductCommentProps) {
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return
    
    setSubmitting(true)
    setError('')
    
    try {
      await onSubmit(comment)
      setComment('')
    } catch (error) {
      setError('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white-700">Add a comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-purple-500 focus:ring-purple-500 sm:text-sm 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={2}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {comment.userPhoto ? (
                  <Image
                    src={comment.userPhoto}
                    alt={comment.userName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm">
                      {comment.userName[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
              <div className="mt-1 text-sm text-gray-700">{comment.comment}</div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 