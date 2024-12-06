"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { ShoppingCart } from "lucide-react"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600">
            Nepathrift
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/shop" className="hover:text-purple-600">
              Shop
            </Link>
            <Link href="/sell" className="hover:text-purple-600">
              Sell
            </Link>
            <Link href="/about" className="hover:text-purple-600">
              About
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-purple-600">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="hover:text-purple-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="hover:text-purple-600"
              >
                Sign In
              </Link>
            )}
            <Link href="/cart" className="relative hover:text-purple-600">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}