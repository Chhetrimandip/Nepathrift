import { Playfair_Display, Poppins } from "next/font/google"
import Link from "next/link"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ["latin"] 
})

export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className={`${playfair.className} text-4xl font-bold mb-4`}>
            Welcome to Nepathrift
          </h1>
          <p className={`${poppins.className} text-lg mb-6`}>
            Discover unique, sustainable fashion at affordable prices. Join our community of conscious shoppers.
          </p>
          <div className="space-x-4">
            <Link 
              href="/shop" 
              className={`${poppins.className} bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors`}
            >
              Shop Now
            </Link>
            <Link 
              href="/sell" 
              className={`${poppins.className} border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors`}
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

