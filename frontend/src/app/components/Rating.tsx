"use client"

import { useState } from 'react'

interface RatingProps {
  value: number
  onChange: (rating: number) => void
}

export function Rating({ value, onChange }: RatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl ${
            star <= (hover || value) 
              ? 'text-yellow-400' 
              : 'text-gray-300'
          }`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  )
} 