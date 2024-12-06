"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      window.location.reload()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600">
            Nepathrift
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/shop" className="text-gray-700 hover:text-purple-600">
              Shop
            </Link>
            
            {user ? (
              <>
                <Link href="/sell" className="text-gray-700 hover:text-purple-600">
                  Sell
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-purple-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/signin"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}