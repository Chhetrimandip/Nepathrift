import Image from "next/image"
import Link from "next/link"
import MandalaBackground from "./components/MandalaBackground"
import MandalaDivider from "./components/MandalaDivider"
import FeaturedCategories from "./components/FeaturedCategories"
import ItemGrid from "./components/ItemGrid"

export default function HomePage() {
  return (
    <>
      <MandalaBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Discover Unique Fashion Treasures
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Where style meets sustainability. Find pre-loved fashion pieces that tell a story.
            </p>
            <Link
              href="/shop"
              className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold 
                hover:bg-purple-700 transition-colors inline-flex items-center group"
            >
              Start Shopping
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
        
        {/* Floating Fashion Images */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-[500px] h-[600px]">
            <Image
              src="/fashion-cutout-1.png"
              alt="Fashion Item"
              width={300}
              height={400}
              className="absolute top-0 right-0 animate-float-slow"
            />
            <Image
              src="/fashion-cutout-2.png"
              alt="Fashion Item"
              width={250}
              height={350}
              className="absolute bottom-0 left-0 animate-float-slower"
            />
          </div>
        </div>
      </section>

      <MandalaDivider />

      {/* Featured Categories */}
      <section className="relative">
        <FeaturedCategories />
      </section>

      <MandalaDivider />

      {/* Featured Items */}
      <section className="relative">
        <ItemGrid />
      </section>

      <MandalaDivider />

      {/* About Section */}
      <section className="relative py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-8">
              Nepathrift brings together the rich cultural heritage of Nepal and modern fashion sensibilities.
              We believe in sustainable fashion that celebrates both tradition and contemporary style.
            </p>
            <Link
              href="/about"
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center group"
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

