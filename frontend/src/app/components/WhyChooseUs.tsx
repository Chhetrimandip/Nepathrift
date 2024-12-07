import { Dancing_Script, Playfair_Display } from "next/font/google"

const dancing = Dancing_Script({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-purple-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className={`${dancing.className} text-2xl text-purple-600 dark:text-purple-400 text-center mb-2`}>
          Why Choose Us?
        </h2>
        <h3 className={`${playfair.className} text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200`}>
          The Nepathrift Difference
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h4 className={`${playfair.className} text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200`}>
                Curated Selection
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Each piece is carefully selected for quality and style
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h4 className={`${playfair.className} text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200`}>
                Sustainable Fashion
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce waste while looking fabulous
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h4 className={`${playfair.className} text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200`}>
                Community First
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Supporting local sellers and sustainable practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 