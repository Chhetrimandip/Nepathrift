import "./globals.css"
import { Inter } from "next/font/google"
import { CartProvider } from "../contexts/CartContext"
import Navbar from "./components/Navbar"
import DynamicBackground from "./components/DynamicBackground"
import FloatingFashionCutouts from "./components/FloatingFashionCutouts"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nepathrift - Modern Thrift Store",
  description: "Discover unique, sustainable fashion at Nepathrift",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 relative min-h-screen flex flex-col`}>
        <DynamicBackground />
        <FloatingFashionCutouts />
        <CartProvider>
          <Navbar />
          <div className="relative z-10 flex-grow">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

