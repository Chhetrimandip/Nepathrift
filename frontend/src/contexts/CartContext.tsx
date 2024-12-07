"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

interface CartItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
  imageUrl: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useAuth()
  
  // Load cart data with user-specific key
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.uid}`)
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      } else {
        setCart([]) // Clear cart if no saved data for this user
      }
    } else {
      setCart([]) // Clear cart when no user is logged in
    }
  }, [user]) // Depend on user to reload cart when user changes

  // Save cart data with user-specific key
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart))
    }
  }, [cart, user])

  const addToCart = (item: CartItem) => {
    if (!user) return // Prevent adding to cart if not logged in
    setCart(prevCart => {
      const existingItem = prevCart.find(
        i => i.id === item.id && i.size === item.size
      )
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prevCart, item]
    })
  }

  // Other cart functions remain the same but should check for user
  const removeFromCart = (itemId: string) => {
    if (!user) return
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!user) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    if (!user) return
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      total 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

