import Link from "next/link"
import { Playfair_Display, Poppins } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['600'],
  subsets: ["latin"] 
})

const categories = [
  { name: "Clothing", icon: "👚" },
  { name: "Accessories", icon: "👜" },
  { name: "Shoes", icon: "👞" },
  { name: "Vintage", icon: "🕰️" },
]

export default function FeaturedCategories() {
  return (
    <section className="py-8">
      <h2 className={`${playfair.className} text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100`}>
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/shop/${category.name.toLowerCase()}`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <h3 className={`${poppins.className} font-semibold text-gray-800 dark:text-gray-200`}>
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

