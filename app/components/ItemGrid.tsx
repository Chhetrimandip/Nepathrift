"'use client'"

import { useState } from "'react'"
import Image from "next/image"
import Link from "next/link"

const items = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: 39.99,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Retro Sneakers",
    price: 29.99,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    price: 45.99,
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Boho Summer Dress",
    price: 34.99,
    image: "/placeholder.svg",
  },
]

export default function ItemGrid() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

