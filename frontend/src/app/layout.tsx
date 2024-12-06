import { Inter } from "next/font/google"
import { AuthProvider } from "../contexts/AuthContext"
import { CartProvider } from "../contexts/CartContext"
import Navbar from "./components/Navbar"
import DynamicBackground from "./components/DynamicBackground"
import Footer from "./components/Footer"
import { metadata } from "./metadata"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 relative min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <DynamicBackground />
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

