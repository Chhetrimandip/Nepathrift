"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const cutouts = [
  "/fashion/cutout1.png",
  "/fashion/cutout2.png",
  "/fashion/cutout3.png",
  "/fashion/cutout4.png",
]

const FloatingFashionCutouts = () => {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    // Initialize random positions
    const newPositions = cutouts.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setPositions(newPositions)

    // Animate positions
    const interval = setInterval(() => {
      setPositions(prev =>
        prev.map(pos => ({
          x: (pos.x + Math.random() * 2 - 1) % 100,
          y: (pos.y + Math.random() * 2 - 1) % 100,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none -z-5">
      {cutouts.map((src, i) => (
        <div
          key={src}
          className="absolute transition-all duration-3000 ease-in-out"
          style={{
            left: `${positions[i]?.x ?? 0}%`,
            top: `${positions[i]?.y ?? 0}%`,
            opacity: 0.1,
          }}
        >
          <Image
            src={src}
            alt="Fashion cutout"
            width={200}
            height={200}
            className="w-32 h-32 object-contain"
          />
        </div>
      ))}
    </div>
  )
}

export default FloatingFashionCutouts

