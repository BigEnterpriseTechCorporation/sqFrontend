"use client"

import { useEffect, useState } from "react";
import { UnitWithExercises } from "@/types";
import unitAndExercises from "@/hooks/unitAndExercises";
import { useParams } from "next/navigation";
import ExerciseCard from "@/components/ExerciseCard";
import WavePink from "@/assets/icons/wave-pink.svg"
import Navigation from "@/components/navigation";
import UnitTitle from "@/components/unitTitle";

export default function UnitPage() {
    const params = useParams();
    const [unit, setUnit] = useState<UnitWithExercises | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnitAndExercises = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found');
                    return;
                }
                const id = params.id as string;
                if (!id) {
                    setError('No unit ID provided');
                    return;
                }
                const response = await unitAndExercises({ token, id });
                setUnit(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch unit and exercises');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUnitAndExercises();
        }
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>;
    }

    if (!unit) {
        return <div className="text-center p-10">Unit not found</div>;
    }

    return (
        <main className="min-h-screen bg-bg1">
            <Navigation/>
            {/* Header with wavy border */}
            <UnitTitle title={unit.title}/>

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-bg3 p-6 rounded-lg mb-10 shadow-sm border-2 border-black">

                    <div className="flex justify-between text-sm opacity-75">
                        <p><strong>Created by:</strong> {unit.ownerName}</p>
                        <p className={"font-bold"}>Exercises: {unit.exerciseCount}</p>
                    </div>
                </div>

                <p className="text-lg mb-4">{unit.description}</p>

                <h2 className="text-3xl font-semibold mb-6">Exercises</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {unit.exercises.map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                </div>
            </div>
        </main>
    );
}