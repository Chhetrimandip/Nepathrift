import Link from "next/link"

const categories = [
  { name: "Clothing", icon: "👚" },
  { name: "Accessories", icon: "👜" },
  { name: "Shoes", icon: "👞" },
  { name: "Vintage", icon: "🕰️" },
]

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/shop/${category.name.toLowerCase()}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <h3 className="font-semibold text-gray-800">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

