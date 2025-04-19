import { token } from "@/types";
import { Exercise } from "@/types";
import allUnits from "./allUnits";
import { API } from "@/utils/api";

export default async function allExercises(formData: {token:token}): Promise<Exercise[]> {
    try {
        // First fetch all units
        const units = await allUnits(formData);
        let allExercises: Exercise[] = [];
        
        // Then fetch exercises for each unit
        for (const unit of units) {
            try {
                const exercises = await API.exercises.getByUnitId<Exercise[]>(formData.token, unit.id);
                
                if (Array.isArray(exercises)) {
                    allExercises = [...allExercises, ...exercises];
                }
            } catch {
                console.warn(`Failed to fetch exercises for unit ${unit.id}`);
                // Continue with the next unit if this one fails
            }
        }
        
        return allExercises;
    } catch (error) {
        console.error('Fetch all exercises error:', error);
        throw error;
    }
} 