import { Playfair_Display, Poppins } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['600'],
  subsets: ["latin"] 
})

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`${playfair.className} text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100`}>
        About Nepathrift
      </h1>
      
      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className={`${poppins.className} text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400`}>
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At Nepathrift, we're revolutionizing the way people think about second-hand fashion. 
            Our mission is to make sustainable fashion accessible to everyone while reducing textile waste 
            and supporting local communities.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, Nepathrift began as a small community of fashion enthusiasts 
            who wanted to make a difference. Today, we've grown into a thriving marketplace 
            where sellers can give their pre-loved items a second life and buyers can discover 
            unique pieces at affordable prices.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sustainability</h2>
          <p className="text-gray-600 mb-4">
            Every piece of clothing bought second-hand reduces the environmental impact of fashion. 
            By choosing Nepathrift, you're part of a movement that saved millions of gallons of water 
            and reduced carbon emissions from new clothing production.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Community Guidelines</h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li className="mb-2">All items must be authentic and in good condition</li>
            <li className="mb-2">Accurate descriptions and clear photos are required</li>
            <li className="mb-2">Fair pricing and respectful communication</li>
            <li className="mb-2">Quick response times and reliable shipping</li>
          </ul>
        </section>
      </div>
    </div>
  )
}