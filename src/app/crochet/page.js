'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search } from 'lucide-react'

function SideMenu({ isOpen, onClose }) {
    const menuRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose()
            }
        }

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick)
            document.addEventListener('keydown', handleEscapeKey)
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div ref={menuRef} className="fixed left-0 top-0 bottom-0 w-64 bg-white p-4 shadow-lg">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                </button>
                <nav className="mt-8 space-y-4">
                    <Link href="/community" className="block">
                        <button className="w-full py-6 text-lg font-semibold bg-[#C17F65] hover:bg-[#B57058] text-white rounded-full transition duration-200">
                            COMMUNITY
                        </button>
                    </Link>

                    <Link href="/crochet" className="block">
                        <button className="w-full py-6 text-lg font-semibold bg-[#7797B7] hover:bg-[#6A89A8] text-white rounded-full transition duration-200">
                            CROCHET
                        </button>
                    </Link>

                    <Link href="/embroidery" className="block">
                        <button className="w-full py-6 text-lg font-semibold bg-[#F5A9D3] hover:bg-[#E899C1] text-white rounded-full transition duration-200">
                            EMBROIDERY
                        </button>
                    </Link>

                    <Link href="/helper" className="block">
                        <button className="w-full py-6 text-lg font-semibold bg-[#BEA99D] hover:bg-[#AD988C] text-white rounded-full transition duration-200">
                            VIRTUAL HELPER
                        </button>
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default function CrochetSchemes() {
    const [page, setPage] = useState(1)
    const [schemes, setSchemes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [filter, setFilter] = useState('')

    useEffect(() => {
        setSchemes([])
        setPage(1)
        fetchSchemes(1, filter)
    }, [filter])

    const fetchSchemes = async (pageNumber, filterValue) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/crochet-schemes?page=${pageNumber}&filter=${encodeURIComponent(filterValue)}`);
            if (!res.ok) {
                throw new Error('An error occurred while fetching the data.');
            }
            const newData = await res.json();

            setSchemes((prevSchemes) => {
                if (prevSchemes) {
                    const existingIds = new Set(prevSchemes.map(scheme => scheme.id));
                    const uniqueNewSchemes = newData.data.filter(scheme => {
                        if (!existingIds.has(scheme.id)) {
                            existingIds.add(scheme.id);
                            return true;
                        }
                        return false;
                    });

                    return [
                        ...prevSchemes,
                        ...uniqueNewSchemes,
                    ];
                }
                return newData.data;
            });

            setHasMore(newData.currentPage < newData.totalPages);
        } catch (err) {
            setError('Failed to load crochet schemes. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchSchemes(nextPage, filter)
        }
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
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
                <button className="text-gray-400" onClick={() => setIsMenuOpen(true)}>
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-serif text-center text-[#1C3D5A]">CROCHET SCHEMES</h1>
                <div className="w-10" /> {/* Placeholder for alignment */}
            </header>

            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Filter input */}
            <div className="container mx-auto px-4 py-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter schemes..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="w-full p-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7797B7]"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="text-red-500 text-center mb-4">
                        {error}
                    </div>
                )}
                {schemes.length === 0 && !error && isLoading && (
                    <div className="text-center mb-4">Loading...</div>
                )}
                {schemes.length > 0 && (
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
                                            className="rounded-lg object-cover"
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
                        disabled={isLoading || !hasMore}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            </main>
        </div>
    )
}