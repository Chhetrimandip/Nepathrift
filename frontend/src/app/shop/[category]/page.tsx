import dynamic from 'next/dynamic'

// Create a client component for the category content
const CategoryContent = dynamic(() => import('./CategoryContent'))

export const runtime = 'edge'
export const revalidate = 0

export default function CategoryPage() {
  return <CategoryContent />
} 