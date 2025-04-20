"use client"

import { useState, useEffect } from 'react'
import allUnits from "@/hooks/content/allUnits"
import { useToken } from "@/hooks/auth"
import { Unit } from "@/types"
import UnitTitle from "@/components/layout/UnitTitle"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"
import UnitsList from "@/components/Units/UnitsList"
import LoadingState from "@/components/Units/LoadingState"
import ErrorState from "@/components/Units/ErrorState"
import {useRouter} from "next/navigation";

export default function Units() {
    const router = useRouter();

    const [units, setUnits] = useState<Unit[]>([])
    const [visibleUnits, setVisibleUnits] = useState<Unit[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { getToken, hasToken } = useToken()

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                if (!hasToken()) {
                    router.push("/auth")
                    return
                }
                const token = getToken()
                
                if (!token) {
                    router.push("/auth")
                    return
                }
                
                const response = await allUnits({ token })
                
                // Sort units by title alphabetically
                const sortedUnits = [...response].sort((a, b) => 
                    a.title.localeCompare(b.title)
                )
                
                setUnits(sortedUnits)
                // Show all units at once
                setVisibleUnits(sortedUnits)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch units')
            } finally {
                setLoading(false)
            }
        }

        fetchUnits()
    }, [getToken, hasToken, router]);

    // No need for load more function anymore
    const handleLoadMore = () => {
        // This function is kept for compatibility with UnitsList component
        // but it won't be called since all units are visible
    }

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState error={error} />
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="flex-grow bg-bg1">
                <UnitTitle title="Юниты" className={"text-8xl"}/>
                <UnitsList 
                    visibleUnits={visibleUnits} 
                    units={units} 
                    onLoadMore={handleLoadMore}
                />
            </div>
            <Footer/>
        </div>
    )
}