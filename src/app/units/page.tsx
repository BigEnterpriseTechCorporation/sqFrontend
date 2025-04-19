"use client"

import { useState, useEffect } from 'react'
import allUnits from "@/hooks/content/allUnits"
import { Unit } from "@/types"
import UnitTitle from "@/components/layout/UnitTitle"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"
import UnitsList from "@/components/Units/UnitsList"
import LoadingState from "@/components/Units/LoadingState"
import ErrorState from "@/components/Units/ErrorState"

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
        return <LoadingState />
    }

    if (error) {
        return <ErrorState error={error} />
    }

    return (
        <main className="min-h-screen bg-bg1">
            <Navigation />
            <UnitTitle title="Юниты" />
            <UnitsList 
                visibleUnits={visibleUnits} 
                units={units} 
                onLoadMore={handleLoadMore}
            />
            <Footer/>
        </main>
    )
}