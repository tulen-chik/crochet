"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, Menu } from 'lucide-react'
import useSWR from 'swr'

// Fetcher function for SWR
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
}

export default function CrochetSchemes() {
    const [page, setPage] = useState(1)
    const { data, error } = useSWR(`/api/crochet-schemes?page=${page}`, fetcher)
    const loadMore = () => {
        setPage(prev => prev + 1)
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
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        Failed to load crochet schemes. Please try again later.
                    </div>
                )}
                {!data && !error && (
                    <div className="text-center mb-4">Loading...</div>
                )}
                {data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.data.map((scheme) => (
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
                )}
                <div className="mt-8 text-center">
                    <button
                        onClick={loadMore}
                        className="bg-[#7797B7] hover:bg-[#6A89A8] text-white px-4 py-2 rounded"
                        disabled={!data}
                    >
                        Load More
                    </button>
                </div>
            </main>
        </div>
    )
}