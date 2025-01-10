import Image from "next/image"
import Link from "next/link"
import MandalaBackground from "./components/MandalaBackground"
import MandalaDivider from "./components/MandalaDivider"
import FeaturedCategories from "./components/FeaturedCategories"
import ItemGrid from "./components/ItemGrid"
import { Playfair_Display, Poppins, Roboto } from "next/font/google"
import WhyChooseUs from "./components/WhyChooseUs"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"] 
})
const roboto = Roboto({ 
  weight: ['400', '500'],
  subsets: ["latin"] 
})

export default function HomePage() {
  return (
    <>
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-r from-rose-400 to-orange-300 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl backdrop-blur-sm bg-white/30 p-8 rounded-3xl">
            <h1 className={`${playfair.className} text-5xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-gray-100`}>
              Discover Unique Fashion Treasures
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
              Where style meets sustainability. Find pre-loved fashion pieces that tell a story.
            </p>
            <Link
              href="/shop"
              className="bg-white/80 text-rose-400 px-8 py-3 rounded-full text-lg font-semibold 
                hover:bg-white dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700 
                transition-all duration-300 inline-flex items-center group shadow-lg hover:shadow-xl"
            >
              Start Shopping
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className={`${poppins.className} text-3xl font-bold text-purple-600 dark:text-purple-400`}>1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className={`${poppins.className} text-3xl font-bold text-purple-600 dark:text-purple-400`}>500+</h3>
              <p className="text-gray-600 dark:text-gray-300">Unique Items</p>
            </div>
            <div className="text-center">
              <h3 className={`${poppins.className} text-3xl font-bold text-purple-600 dark:text-purple-400`}>100%</h3>
              <p className="text-gray-600 dark:text-gray-300">Sustainable</p>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us section */}
      <WhyChooseUs />


      {/* Featured Categories */}
      <section className="relative py-8 bg-gray-50 dark:bg-gray-800">
        <FeaturedCategories />
      </section>

      {/* Featured Items */}
      <section className="relative bg-white dark:bg-gray-900 py-8">
        <ItemGrid />
      </section>

      {/* About Section */}
      <section className="relative py-16 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`${playfair.className} text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100`}>
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Nepathrift brings together the rich cultural heritage of Nepal and modern fashion sensibilities.
              We believe in sustainable fashion that celebrates both tradition and contemporary style.
            </p>
            <Link
              href="/about"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium inline-flex items-center group"
            >
              Learn More
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

