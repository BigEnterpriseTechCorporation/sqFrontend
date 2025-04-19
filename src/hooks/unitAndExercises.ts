import {token, UnitWithExercises} from "@/types";
import {Unit} from "@/types";

export default async function unitAndExercises(formData: {token:token, id:string}):Promise<UnitWithExercises> {
    try {
        // First, get the basic unit information
        const unitResponse = await fetch(`https://rpi.tail707b9c.ts.net/api/v1/Units/${formData.id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${formData.token}`,
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
        });

        if (!unitResponse.ok) {
            throw new Error(`HTTP error! status: ${unitResponse.status}`);
        }

        const unitData = await unitResponse.json();

        // Then, get the exercises for this unit
        const exercisesResponse = await fetch(`https://rpi.tail707b9c.ts.net/api/v1/Units/${formData.id}/exercises`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${formData.token}`,
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
        });

        if (!exercisesResponse.ok) {
            // If we can't get exercises, we'll still return the unit with an empty exercises array
            console.warn(`Couldn't load exercises for unit ${formData.id}. Status: ${exercisesResponse.status}`);
            return { ...unitData, exercises: [] };
        }

        const exercisesData = await exercisesResponse.json();
        
        // Combine the unit data with the exercises data
        return {
            ...unitData,
            exercises: Array.isArray(exercisesData) ? exercisesData : []
        };
    } catch (error) {
        console.error('Unit and exercises fetch error:', error);
        throw error;
    }
}
