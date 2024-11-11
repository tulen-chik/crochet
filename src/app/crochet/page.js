"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, Menu } from 'lucide-react'

// Mock data for crochet schemes
const crochetSchemes = [
  { id: 1, title: 'Granny Square Flowers', colors: 'cyan, mustard, white', image: '/placeholder.svg?height=200&width=200' },
  { id: 2, title: 'Granny Square Moon', colors: 'blue, dark blue, white', image: '/placeholder.svg?height=200&width=200' },
  { id: 3, title: 'Granny Square Sunburst', colors: 'dark pink, pink, white', image: '/placeholder.svg?height=200&width=200' },
  // Add more schemes here...
]

export default function CrochetSchemes() {
  const [schemes, setSchemes] = useState(crochetSchemes)

  const loadMore = () => {
    // Simulate loading more schemes
    setSchemes([...schemes, ...crochetSchemes])
  }

  return (
      <div className="min-h-screen bg-[#FFFBF6] relative">
        {/* Decorative border */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-left opacity-20" />
          <div className="absolute right-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-right opacity-20" />
        </div>

        {/* Header */}
        <header className="relative z-10 p-4 flex justify-between items-center">
          <button className="text-gray-400">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-serif text-center text-[#1C3D5A]">CROCHET SCHEMES</h1>
          <div className="w-10" /> {/* Placeholder for alignment */}
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
                <Link href={`/crochet/${scheme.id}`} key={scheme.id}>
                  <div className="hover:shadow-lg transition-shadow duration-300 bg-[#FFF8E7] border-[#C5A572] p-4 rounded-lg">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-[#1C3D5A]">{scheme.title}</h2>
                    </div>
                    <div className="p-4">
                      <Image
                          src={scheme.image}
                          alt={scheme.title}
                          width={200}
                          height={200}
                          className="rounded-lg mb-2"
                      />
                      <p className="text-sm text-gray-600">{scheme.colors}</p>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={loadMore} className="bg-[#7797B7] hover:bg-[#6A89A8] text-white px-4 py-2 rounded">
              Load More
            </button>
          </div>
        </main>
      </div>
  )
}