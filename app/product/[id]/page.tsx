"use client"

import Image from "next/image"
import { useState } from "react"
import { useCart } from "../../../contexts/CartContext"

const product = {
  id: 1,
  name: "Vintage Denim Jacket",
  price: 39.99,
  description: "A classic denim jacket with a worn-in look. Perfect for layering in any season.",
  image: "/placeholder.svg",
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("") // Added state for selected size

  const { addToCart } = useCart()

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
    })
    alert("Product added to cart!")
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <Image src={product.image} alt={product.name} width={600} height={600} className="w-full h-auto rounded-lg shadow-md" />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-green-600 font-bold mb-4">${product.price.toFixed(2)}</p>
        <p className="mb-4">{product.description}</p>
        <div className="flex items-center mb-4">
          <label htmlFor="quantity" className="mr-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        {/* Added size selection */}
        <div className="mb-4">
          <label htmlFor="size" className="block mb-2">Size:</label>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Select Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <button
          onClick={addToCart}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

