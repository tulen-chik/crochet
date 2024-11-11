"use client"
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// Mock data for a single embroidery scheme
const getEmbroideryScheme = (id) => ({
  id,
  title: `Embroidery Pattern ${id}`,
  tags: 'art, minimalism',
  image: '/placeholder.svg?height=400&width=400',
  difficulty: 'Intermediate',
  description: 'This is a detailed description of the embroidery pattern. It includes information about the techniques used, the recommended fabric, and any special considerations.',
  materials: [
    { item: 'Embroidery Hoop', size: '6 inch' },
    { item: 'Embroidery Needle', size: 'Size 7' },
    { item: 'Cotton Thread', colors: 'DMC 310, 3371, 3721' },
    { item: 'Aida Cloth', count: '14 count' },
  ],
  instructions: [
    'Step 1: Transfer the pattern to your fabric using your preferred method.',
    'Step 2: Start with the outline stitches using DMC 310.',
    'Step 3: Fill in the main areas using satin stitch with DMC 3371.',
    'Step 4: Add details and highlights with DMC 3721.',
    // Add more steps as needed
  ]
})

export default function EmbroideryDiagram({ id }) {
  const scheme = getEmbroideryScheme(id)

  return (
      <div className="min-h-screen bg-[#FFFBF6] relative">
        {/* Decorative border */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-left opacity-20" />
          <div className="absolute right-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-right opacity-20" />
        </div>

        {/* Header */}
        <header className="relative z-10 p-4 flex justify-between items-center">
          <Link href="/embroidery">
            <button className="text-pink-500">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-3xl font-serif text-center text-pink-500">{scheme.title}</h1>
          <div className="w-10" /> {/* Placeholder for alignment */}
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-[#FFF8E7] border-pink-200 p-4 rounded-lg">
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-pink-700">{scheme.title}</h2>
              <div className="flex gap-2 mt-2">
                <span className="text-sm px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                  {scheme.difficulty}
                </span>
                <span className="text-sm text-gray-600">{scheme.tags}</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 p-4">
              <div>
                <div className="relative aspect-square mb-4">
                  <Image
                      src={scheme.image}
                      alt={scheme.title}
                      fill
                      className="rounded-lg object-cover"
                  />
                </div>
                <p className="mb-6">{scheme.description}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pink-700">Materials Needed</h2>
                  <table className="w-full text-left">
                    <thead>
                    <tr>
                      <th className="border-b-2 border-gray-200 pb-2">Item</th>
                      <th className="border-b-2 border-gray-200 pb-2">Specifications</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scheme.materials.map((material, index) => (
                        <tr key={index}>
                          <td className="border-b border-gray-200 py-2">{material.item}</td>
                          <td className="border-b border-gray-200 py-2">
                            {material.size || material.colors || material.count}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pink-700">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {scheme.instructions.map((step, index) => (
                        <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
