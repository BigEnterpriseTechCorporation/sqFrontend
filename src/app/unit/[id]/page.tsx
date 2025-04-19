"use client"

import { useEffect, useState } from "react";
import {UnitWithExercises} from "@/types";
import unitAndExercises from "@/hooks/unitAndExercises";
import { useParams } from "next/navigation";
import UnitTitle from "@/components/unitTitle";

export default function UnitPage() {
    const params = useParams();
    const [unit, setUnit] = useState<UnitWithExercises>(null);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!unit) {
        return <div>Unit not found</div>;
    }

    return (
        <main>
            <UnitTitle title={unit.title} />
            <div>
                <p>{unit.description}</p>
                <p>Created by: {unit.ownerName}</p>
                <p>Exercises: {unit.exerciseCount}</p>
            </div>

            <div>
                <h2>Exercises</h2>
                {unit.exercises.map((exercise) => (
                    <div key={exercise.id}>
                        <h3>{exercise.title}</h3>
                        <p>{exercise.description}</p>
                        <p>Type: {exercise.type}</p>
                        <p>Difficulty: {exercise.difficulty}</p>
                        <p>Check Type: {exercise.checkType}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}