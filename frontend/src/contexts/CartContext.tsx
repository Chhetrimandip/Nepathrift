"use client"

import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  size?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      const validCart = parsedCart.filter(item => 
        typeof item.price === 'number' && !isNaN(item.price) && 
        typeof item.quantity === 'number' && !isNaN(item.quantity) // Validate quantity
      )
      setItems(validCart)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      
      return [...currentItems, newItem]
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    console.log(`Updating quantity for itemId: ${itemId}, New Quantity: ${quantity}`); // Debugging line
    if (isNaN(quantity) || quantity < 1) return; // Prevent invalid quantities

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    return sum + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
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

