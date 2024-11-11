"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import useSWR from 'swr'
import {use} from "react";

const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
}

export default function CrochetDiagram({ params }) {
    const { id } = use(params);

    const { data: scheme, error } = useSWR(`/api/crochet-schemes/${id}`, fetcher)

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFFBF6] flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p>Failed to load crochet scheme. Please try again later.</p>
                    <Link href="/crochet" className="text-blue-500 underline mt-4 block">
                        Return to Crochet Schemes
                    </Link>
                </div>
            </div>
        )
    }

    if (!scheme) {
        return (
            <div className="min-h-screen bg-[#FFFBF6] flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    // Преобразуем объект инструкций в массив
    const instructionsArray = Object.values(scheme.instructions);

    return (
        <div className="min-h-screen bg-[#FFFBF6] relative">
            {/* Decorative border */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-left opacity-20" />
                <div className="absolute right-0 top-0 w-24 h-full bg-[url('/placeholder.svg?height=600&width=100')] bg-contain bg-right opacity-20" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-4 flex justify-between items-center">
                <Link href="/crochet">
                    <button className="text-gray-400">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                </Link>
                <h1 className="text-3xl font-serif text-center text-[#1C3D5A]">{scheme.title}</h1>
                <div className="w-10" /> {/* Placeholder for alignment */}
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <div className="bg-[#FFF8E7] border-[#C5A572] p-4 rounded-lg">
                    <div className="p-4">
                        <h2 className="text-2xl font-semibold text-[#1C3D5A]">{scheme.title}</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 p-4">
                        <div className="md:w-1/2">
                            <Image
                                src={scheme.image}
                                alt={scheme.title}
                                width={400}
                                height={400}
                                className="rounded-lg mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-4">Colors: {scheme.colors}</p>
                            <p className="mb-4">{scheme.description}</p>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                            <ol className="list-decimal list-inside space-y-2">
                                {instructionsArray.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
