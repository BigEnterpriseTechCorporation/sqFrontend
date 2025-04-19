import { token, Exercise } from "@/types";
import { API } from '@/utils/api';

export default async function exercise(formData: {token:token, id:string}): Promise<Exercise> {
    try {
        return await API.exercises.getById<Exercise>(formData.token, formData.id);
    } catch (error) {
        console.error('Exercise fetch error:', error);
        throw error;
    }
}
