"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

type Product = {
  id: number
  title: string
  price: number
  status: "active" | "pending" | "sold"
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // In a real app, fetch the seller's products from an API
    const mockProducts: Product[] = [
      { id: 1, title: "Vintage Denim Jacket", price: 39.99, status: "active" },
      { id: 2, title: "Retro Sunglasses", price: 19.99, status: "pending" },
      { id: 3, title: "Classic Leather Bag", price: 49.99, status: "sold" },
    ]
    setProducts(mockProducts)
  }, [])

  const deleteProduct = (id: number) => {
    // In a real app, send a delete request to your API
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      <Link href="/sell" className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300 inline-block mb-8">
        List New Product
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.status === "active" ? "bg-green-100 text-green-800" : 
                      product.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-gray-100 text-gray-800"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/edit-product/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="inline-block" size={18} />
                  </Link>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="inline-block" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

