"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Menu, X, User } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Nepathrift
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-600 hover:text-gray-800">
              Shop
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-gray-800">
              Sell
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-800">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              <User className="w-6 h-6" />
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-100">
            <div className="flex flex-col space-y-4 px-4 py-6">
              <Link
                href="/shop"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/sell"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/cart"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

