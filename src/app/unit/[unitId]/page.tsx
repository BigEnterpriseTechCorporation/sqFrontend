"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnitWithExercises } from "@/types";
import unitAndExercises from "@/hooks/content/unitAndExercises";
import { useToken } from "@/hooks/auth";
import Navigation from "@/components/layout/Navigation";
import UnitTitle from "@/components/layout/UnitTitle";

// Imported components
import UnitHeader from "@/components/Unit/UnitHeader";
import UnitDescription from "@/components/Unit/UnitDescription";
import ExercisesList from "@/components/Unit/ExercisesList";
import LoadingSpinner from "@/components/Unit/LoadingSpinner";
import ErrorMessage from "@/components/Unit/ErrorMessage";
import Footer from "@/components/layout/Footer";

export default function UnitPage() {
    const params = useParams();
    const { getToken, hasToken } = useToken();
    const [unit, setUnit] = useState<UnitWithExercises | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [markdownContent, setMarkdownContent] = useState<string>("");

    useEffect(() => {
        const fetchUnitAndExercises = async () => {
            try {
                if (!hasToken()) {
                    setError('No authentication token found');
                    return;
                }
                const token = getToken();
                const unitId = params.unitId as string;
                
                if (!token) {
                    setError('Authentication token is null');
                    return;
                }
                
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
                
                // Store the raw markdown
                if (processedUnit.description) {
                    setMarkdownContent(processedUnit.description);
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
    }, []);

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
        <div className="flex flex-col min-h-screen">
            <Navigation/>
            <div className="flex-grow bg-bg1">
                <UnitTitle title={unit.title}/>

                <div className="max-w-5xl mx-auto px-4 py-10 mb-10">
                    <UnitHeader 
                        ownerName={unit.ownerName} 
                        exerciseCount={unit.exerciseCount} 
                    />
                    
                    <UnitDescription 
                        markdownContent={markdownContent}
                        fallbackText={unit.description} 
                    />
                    
                    <ExercisesList exercises={unit.exercises} />
                </div>
            </div>

            <Footer/>
        </div>
    );
}