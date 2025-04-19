"use client"

import { useState, useEffect } from 'react'
import allUnits from "@/hooks/allUnits"
import { Unit } from "@/types"
import UnitTitle from "@/components/unitTitle"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer";

export default function Units() {
    const [units, setUnits] = useState<Unit[]>([])
    const [visibleUnits, setVisibleUnits] = useState<Unit[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    // Number of units to load initially and on "Load more" click
    const UNITS_PER_PAGE = 4

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError('No authentication token found')
                    return
                }
                const response = await allUnits({ token })
                setUnits(response)
                // Initially show only the first batch of units
                setVisibleUnits(response.slice(0, UNITS_PER_PAGE))
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch units')
            } finally {
                setLoading(false)
            }
        }

        fetchUnits()
    }, [])

    // Check if user is admin
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                
                // Get current user info
                const response = await fetch('/api/account/self', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    const userData = await response.json()
                    // Check if user has admin role
                    setIsAdmin(userData.data?.role === 'Admin' || userData.data?.isAdmin === true)
                }
            } catch (err) {
                console.error('Failed to check user role:', err)
            }
        }
        
        checkUserRole()
    }, [])

    const handleLoadMore = () => {
        const nextUnits = units.slice(visibleUnits.length, visibleUnits.length + UNITS_PER_PAGE)
        setVisibleUnits(prev => [...prev, ...nextUnits])
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-bg1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-bg1 bg-stripes flex justify-center items-center">
                <div className="bg-bg3 p-6 rounded-lg border-2 border-black text-center">
                    <p className="text-xl font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-bg1">
            {/* Navigation */}
            <Navigation />
            
            {/* Title with wavy border */}
            <UnitTitle title="Юниты" />
            
            {/* Admin Controls - Only visible to admin users */}
            {isAdmin && (
                <div className="max-w-5xl mx-auto px-4 mt-6">
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="font-bold text-xl">Content Management</h2>
                                <p className="text-sm text-gray-700">Create and manage units and exercises in the admin panel</p>
                            </div>
                            <div className="flex gap-3">
                                <Link 
                                    href="/admin" 
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                                >
                                    Manage Units
                                </Link>
                                <Link 
                                    href="/admin/exercises" 
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                                >
                                    Manage Exercises
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Units List */}
            <div className="max-w-5xl mx-auto px-4 py-10 relative mb-52 min-h-[60vh]">
                {units.length === 0 ? (
                    <div className="bg-bg2 p-6 rounded-lg border-2 border-black text-center">
                        <p className="text-xl mb-2">No units found</p>
                        {isAdmin && (
                            <p className="text-sm text-gray-600 mt-2">
                                As an admin, you can create units in the Admin Panel.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {visibleUnits.map((unit) => (
                            <div 
                                key={unit.id} 
                                className="bg-bg2 p-6 rounded-lg shadow-md border-2 border-black relative overflow-hidden"
                            >
                                <Link href={`/unit/${unit.id}`} className="block">
                                    <h2 className="text-3xl font-bold mb-2">{unit.title}</h2>

                                    <div className="flex justify-between text-sm mt-4">
                                        <p><strong>Created by:</strong> {unit.ownerName}</p>
                                        <p><strong>Exercises:</strong> {unit.exerciseCount}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {visibleUnits.length < units.length && (
                    <div className="flex justify-center mt-12">
                        <button 
                            onClick={handleLoadMore}
                            className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-black shadow-md hover:bg-gray-100 transition-colors duration-200"
                        >
                            Загрузить ещё
                        </button>
                    </div>
                )}
            </div>

            {/* Footer with Navigation */}
            <Footer/>
        </main>
    )
}