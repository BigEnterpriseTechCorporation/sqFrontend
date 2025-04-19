"use client"

import { useState, useEffect } from 'react'
import allUnits from "@/hooks/allUnits"
import { Unit } from "@/types"
import UnitTitle from "@/components/unitTitle";

export default function Units() {
    const [units, setUnits] = useState<Unit[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

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
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch units')
            } finally {
                setLoading(false)
            }
        }

        fetchUnits()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <main>
            <UnitTitle title={"Units"}/>
            <h1>Units</h1>
            <div>
                {units.map((unit) => (
                    <div key={unit.id}>
                        <UnitTitle title={unit.title} />
                        <p>{unit.description}</p>
                        <p>Created by: {unit.ownerName}</p>
                        <p>Exercises: {unit.exerciseCount}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}