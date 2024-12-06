import Banner from "./components/Banner"
import FeaturedCategories from "./components/FeaturedCategories"
import ItemGrid from "./components/ItemGrid"
import MandalaDivider from "./components/MandalaDivider"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Banner />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <FeaturedCategories />
        <MandalaDivider />
        <ItemGrid />
      </div>
    </main>
  )
}

