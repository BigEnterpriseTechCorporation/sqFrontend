import { token } from "@/types";
import { Unit } from "@/types";
import { API } from "@/utils/api";

export default async function allUnits(formData: {token:token}): Promise<Unit[]> {
    try {
        const units = await API.units.getAll<Unit[]>(formData.token);
        return units;
    } catch (error) {
        console.error('Units fetch error:', error);
        throw error;
    }
}
