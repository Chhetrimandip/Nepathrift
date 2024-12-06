"use client"

import { useEffect, useRef } from "react"

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Mandala parameters
    const mandalas = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 100 + 50,
      rotation: 0,
      speed: Math.random() * 0.001,
      opacity: Math.random() * 0.1,
    }))

    const drawMandala = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity

      // Draw mandala pattern
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4)
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(size/2, size/2, size, size/2, size, 0)
      }
      ctx.strokeStyle = "#6B46C1"
      ctx.stroke()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      mandalas.forEach(mandala => {
        mandala.rotation += mandala.speed
        drawMandala(
          mandala.x,
          mandala.y,
          mandala.size,
          mandala.rotation,
          mandala.opacity
        )
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 to-indigo-50"
    />
  )
}

export default DynamicBackground

