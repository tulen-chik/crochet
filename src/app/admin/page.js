'use client'

import { useState, useEffect } from 'react'
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import LoginForm from '@/components/login-form'

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [colors, setColors] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [description, setDescription] = useState('')
    const [materialsInput, setMaterialsInput] = useState('')
    const [instructionsInput, setInstructionsInput] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isEmbroidery, setIsEmbroidery] = useState(true)
    const [schemes, setSchemes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (isAuthenticated) {
            fetchSchemes(currentPage)
        }
    }, [isAuthenticated, isEmbroidery, currentPage])

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })
            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('token', data.token)
                setIsAuthenticated(true)
            } else {
                setError('Invalid credentials')
            }
        } catch (err) {
            setError('Error logging in: ' + err.message)
        }
    }

    const fetchSchemes = async (page) => {
        setIsLoading(true)
        try {
            const endpoint = isEmbroidery ? `/api/embroidery-schemas?page=${page}` : `/api/crochet-schemes?page=${page}`
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch schemes')
            }
            const data = await response.json()
            console.log('Fetched schemes:', data)
            if (isEmbroidery) {
                setSchemes(data.schemes || [])
            } else {
                setSchemes(data.data || [])
            }
            setTotalPages(data.totalPages || 1)
        } catch (err) {
            setError('Error fetching schemes: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        if (imageFile) {
            formData.append('image', imageFile)
        }

        if (isEmbroidery) {
            formData.append('tags', tags)
            formData.append('difficulty', difficulty)
            formData.append('materials', JSON.stringify(parseMaterials(materialsInput)))
        } else {
            formData.append('colors', colors)
        }

        formData.append('instructions', JSON.stringify(parseInstructions(instructionsInput)))

        const endpoint = isEmbroidery ? '/api/embroidery-schemas' : '/api/crochet-schemes'

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            const result = await response.json()
            if (response.ok) {
                setSuccess('Scheme successfully submitted!')
                resetForm()
                fetchSchemes(currentPage)
            } else {
                setError(result.error || 'Error submitting scheme')
            }
        } catch (err) {
            setError('Error submitting scheme: ' + err.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            const endpoint = isEmbroidery ? `/api/embroidery-schemas/${id}` : `/api/crochet-schemes/${id}`
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to delete scheme')
            }
            setSuccess('Scheme deleted successfully')
            fetchSchemes(currentPage)
        } catch (err) {
            setError('Error deleting scheme: ' + err.message)
        }
    }

    const resetForm = () => {
        setTitle('')
        setTags('')
        setColors('')
        setDifficulty('')
        setDescription('')
        setMaterialsInput('')
        setInstructionsInput('')
        setImageFile(null)
    }

    const parseMaterials = (input) => {
        const lines = input.split('\n')
        return lines.reduce((acc, line) => {
            const [key, value] = line.split(':').map(s => s.trim())
            if (key && value) {
                acc[key] = value
            }
            return acc
        }, {})
    }

    const parseInstructions = (input) => {
        const lines = input.split('\n')
        return lines.reduce((acc, line, index) => {
            acc[`step${index + 1}`] = line.trim()
            return acc
        }, {})
    }

    if (!isAuthenticated) {
        return <LoginForm onLogin={handleLogin} error={error} />
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsEmbroidery(true)}
                    className={`px-4 py-2 rounded-l ${isEmbroidery ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Embroidery
                </button>
                <button
                    onClick={() => setIsEmbroidery(false)}
                    className={`px-4 py-2 rounded-r ${!isEmbroidery ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    Crochet
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                {isEmbroidery ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tags:
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Difficulty:
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </label>
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Colors:
                            <input
                                type="text"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                            />
                        </label>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                {isEmbroidery && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Materials (one per line, format: "name: amount"):
                            <textarea
                                value={materialsInput}
                                onChange={(e) => setMaterialsInput(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                                placeholder="Thread: 2 skeins&#10;Needle: Size 7"
                            />
                        </label>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Instructions (one step per line):
                        <textarea
                            value={instructionsInput}
                            onChange={(e) => setInstructionsInput(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                            rows={5}
                            placeholder="Cut the thread&#10;Thread the needle&#10;Begin stitching"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                        />
                    </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">
                    Submit
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {success && <p className="mt-4 text-green-600">{success}</p>}

            <h2 className="text-xl font-bold mt-8 mb-4">Existing Schemes</h2>
            {!isLoading && schemes && schemes.length > 0 ? (
                <div className="space-y-4">
                    {schemes.map((scheme) => (
                        <div key={scheme.id} className="border border-gray-300 rounded-md p-4 flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{scheme.title}</h3>
                                {isEmbroidery ? (
                                    <>
                                        <p className="text-sm text-gray-600">Tags: {scheme.tags}</p>
                                        <p className="text-sm text-gray-600">Difficulty: {scheme.difficulty}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-600">Colors: {scheme.colors}</p>
                                )}
                                <p className="text-sm text-gray-600 mt-2">{scheme.description?.substring(0, 100)}...</p>
                            </div>
                            <button
                                onClick={() => handleDelete(scheme.id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete scheme"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>{isLoading ? 'Loading schemes...' : 'No schemes found.'}</p>
            )}
            <div className="mt-4 flex justify-center items-center space-x-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}