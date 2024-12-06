"use client"

import { useEffect, useRef } from 'react'

export default function MandalaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Mandala animation
    let rotation = 0
    const mandalas: { x: number; y: number; size: number; speed: number }[] = []
    
    // Create multiple mandalas
    for (let i = 0; i < 5; i++) {
      mandalas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 50 + Math.random() * 100,
        speed: 0.2 + Math.random() * 0.5
      })
    }

    const drawMandala = (x: number, y: number, size: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4)
        ctx.moveTo(0, 0)
        ctx.lineTo(size, 0)
        ctx.arc(size, 0, size/4, 0, Math.PI * 2)
      }
      
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)' // Purple with low opacity
      ctx.stroke()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      mandalas.forEach(mandala => {
        drawMandala(mandala.x, mandala.y, mandala.size, rotation * mandala.speed)
        
        // Move mandalas
        mandala.y += 0.5
        if (mandala.y > canvas.height + mandala.size) {
          mandala.y = -mandala.size
          mandala.x = Math.random() * canvas.width
        }
      })
      
      rotation += 0.005
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
} 