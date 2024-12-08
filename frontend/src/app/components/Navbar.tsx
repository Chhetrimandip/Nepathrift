"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { ShoppingCart, Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useState } from "react"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600 dark:text-purple-400">
            Nepathrift
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/shop" className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
              Shop
            </Link>
            <Link href="/sell" className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
              Sell
            </Link>
            <Link href="/profile" className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
              Profile
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
                  Dashboard
                </Link>
                <button onClick={signOut} className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
                Sign In
              </Link>
            )}
            <ThemeToggle />
            <Link href="/cart" className="relative hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/cart" className="relative hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
            <div className="flex flex-col space-y-4 px-4 py-6">
              <Link 
                href="/shop" 
                className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/sell" 
                className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
              <Link 
                href="/profile" 
                className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }} 
                    className="text-left hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}