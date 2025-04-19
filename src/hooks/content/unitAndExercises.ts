import { token, UnitWithExercises, Exercise } from "@/types";
import { API } from "@/utils/api";

export default async function unitAndExercises(formData: {token:token, id:string}): Promise<UnitWithExercises> {
    try {
        // First, get the basic unit information
        const unit = await API.units.getById<UnitWithExercises>(formData.token, formData.id);
        
        // Then, get the exercises for this unit
        try {
            const exercises = await API.exercises.getByUnitId<Exercise[]>(formData.token, formData.id);
            
            // Return a combined object
            return {
                ...unit,
                exercises: Array.isArray(exercises) ? exercises : []
            };
        } catch {
            // If we can't get exercises, return the unit with an empty exercises array
            console.warn(`Couldn't load exercises for unit ${formData.id}`);
            return {
                ...unit,
                exercises: []
            };
        }
    } catch (error) {
        console.error('Unit and exercises fetch error:', error);
        throw error;
    }
}
