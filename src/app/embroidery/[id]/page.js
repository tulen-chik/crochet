"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import useSWR from 'swr';
import { use } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
}

export default function EmbroideryDiagram({ params }) {
  const { id } = use(params);

  const { data: scheme, error } = useSWR(`/api/embroidery-schemas/${id}`, fetcher);
  console.log(scheme);

  if (error) {
    return (
        <div className="min-h-screen bg-[#FFFBF6] flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>Failed to load embroidery scheme. Please try again later.</p>
            <Link href="/embroidery" className="text-pink-500 underline mt-4 block">
              Return to Embroidery Schemes
            </Link>
          </div>
        </div>
    );
  }

  if (!scheme) {
    return (
        <div className="min-h-screen bg-[#FFFBF6] flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
    );
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
            <div className="flex flex-col md:flex-row gap-8 p-4">
              <div className="md:w-1/2">
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
              <div className="md:w-1/2 space-y-6">
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
                    {Object.entries(scheme.materials).map(([item, spec], index) => (
                        <tr key={index}>
                          <td className="border-b border-gray-200 py-2">{item}</td>
                          <td className="border-b border-gray-200 py-2">{spec}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-pink-700">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {Object.entries(scheme.instructions).map(([step, instruction], index) => (
                        <li key={index} className="text-gray-700">{`${step}: ${instruction}`}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
