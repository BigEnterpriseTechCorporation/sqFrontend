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

    // Number of units to load initially and on "Load more" click
    const UNITS_PER_PAGE = 4

    const [units, setUnits] = useState<Unit[]>([])
    const [visibleUnits, setVisibleUnits] = useState(UNITS_PER_PAGE)
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

                const sortedUnits = [...response].sort((a, b) =>
                    a.title.localeCompare(b.title)
                )

                // Show all units at once
                setUnits(sortedUnits)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch units')
            } finally {
                setLoading(false)
            }
        }

        fetchUnits()
    }, []);

    const handleLoadMore = () => {
        console.info(visibleUnits.length, UNITS_PER_PAGE)
        setVisibleUnits((prev) => prev + UNITS_PER_PAGE)
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
            <div className="flex-grow bg-bg1 pb-32">
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