import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Nepathrift</h3>
            <p className="text-gray-400">Sustainable fashion for everyone.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-white">Sell</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nepathrift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


