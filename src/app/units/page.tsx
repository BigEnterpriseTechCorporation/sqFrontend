"use client"

import { useState, useEffect } from 'react'
import allUnits from "@/hooks/allUnits"
import { Unit } from "@/types"
import UnitTitle from "@/components/unitTitle"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer";
import WaveDark from "@/assets/icons/wave-dark.svg";

export default function Units() {
    const [units, setUnits] = useState<Unit[]>([])
    const [visibleUnits, setVisibleUnits] = useState<Unit[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

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
            
            {/* Units List */}
            <div className="max-w-5xl mx-auto px-4 pb-10 pt-24 relative mb-52 min-h-[60vh]">
                <div className="space-y-6">
                    {visibleUnits.map((unit) => (
                        <div 
                            key={unit.id} 
                            className="bg-bg2 p-6 rounded-lg shadow-orange hover:px-10 ease-in-out duration-300 relative overflow-hidden"
                        >
                            <Link href={`/unit/${unit.id}`} className="block">
                                <h2 className="text-3xl font-bold mb-4">{unit.title}</h2>

                                <div className="flex gap-12 text-sm mt-4">
                                    <p><strong>Created by:</strong> {unit.ownerName}</p>
                                    <p><strong>Exercises:</strong> {unit.exerciseCount}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {visibleUnits.length < units.length && (
                    <div className="flex justify-center mt-12">
                        <button 
                            onClick={handleLoadMore}
                            className="bg-bg3 text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-black shadow-orange hover:bg-gray-100 transition-colors duration-200"
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