import { unstable_cache } from 'next/cache'

export const getProduct = unstable_cache(
  async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
    if (!res.ok) return null
    return res.json()
  },
  ['product'],
  { revalidate: 3600 }
)

export const getProducts = unstable_cache(
  async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
    if (!res.ok) return []
    return res.json()
  },
  ['products'],
  { revalidate: 3600 }
) 