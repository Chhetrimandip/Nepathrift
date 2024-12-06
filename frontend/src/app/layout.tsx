import { Inter } from "next/font/google"
import { AuthProvider } from "../contexts/AuthContext"
import { CartProvider } from "../contexts/CartContext"
import Navbar from "./components/Navbar"
import DynamicBackground from "./components/DynamicBackground"
import FloatingFashionCutouts from "./components/FloatingFashionCutouts"
import Footer from "./components/Footer"
import "@/app/globals.css"

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
        <AuthProvider>
          <CartProvider>
            <DynamicBackground />
            <FloatingFashionCutouts />
            <Navbar />
            <div className="relative z-10 flex-grow">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

