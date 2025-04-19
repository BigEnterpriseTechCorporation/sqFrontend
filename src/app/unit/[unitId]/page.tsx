"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnitWithExercises } from "@/types";
import unitAndExercises from "@/hooks/content/unitAndExercises";
import Navigation from "@/components/layout/Navigation";
import UnitTitle from "@/components/layout/UnitTitle";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Imported components
import UnitHeader from "@/components/Unit/UnitHeader";
import UnitDescription from "@/components/Unit/UnitDescription";
import ExercisesList from "@/components/Unit/ExercisesList";
import LoadingSpinner from "@/components/Unit/LoadingSpinner";
import ErrorMessage from "@/components/Unit/ErrorMessage";

export default function UnitPage() {
    const params = useParams();
    const [unit, setUnit] = useState<UnitWithExercises | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> | null>(null);

    useEffect(() => {
        const fetchUnitAndExercises = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found');
                    return;
                }
                const unitId = params.unitId as string;
                if (!unitId) {
                    setError('No unit ID provided');
                    return;
                }
                
                const response = await unitAndExercises({ token, id: unitId });
                
                // Ensure the response has the expected format
                const processedUnit = {
                    ...response,
                    exercises: response.exercises || [] // Ensure exercises is an array
                };
                
                setUnit(processedUnit);
                
                // Process markdown content
                if (processedUnit.description) {
                    try {
                        const mdxSource = await serialize(processedUnit.description);
                        setMdxSource(mdxSource);
                    } catch (err) {
                        console.error("Failed to process markdown:", err);
                        // Continue without markdown rendering if it fails
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch unit and exercises');
            } finally {
                setLoading(false);
            }
        };

        if (params.unitId) {
            fetchUnitAndExercises();
        }
    }, [params.unitId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!unit) {
        return <div className="text-center p-10">Unit not found</div>;
    }

    return (
        <main className="bg-bg1">
            <Navigation/>
            <UnitTitle title={unit.title}/>

            <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
                <UnitHeader 
                    ownerName={unit.ownerName} 
                    exerciseCount={unit.exerciseCount} 
                />
                
                <UnitDescription 
                    mdxSource={mdxSource} 
                    fallbackText={unit.description} 
                />
                
                <ExercisesList exercises={unit.exercises} />
            </div>
        </main>
    );
}