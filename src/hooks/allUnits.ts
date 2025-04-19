import {token} from "@/types";
import {Unit} from "@/types";

export default async function allUnits(formData: {token:token}):Promise<Unit[]> {
    try {
        const response = await fetch(`https://rpi.tail707b9c.ts.net/api/v1/Units`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${formData.token}`,
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Self info error:', error)
        throw error
    }
}
