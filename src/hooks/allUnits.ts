import {token} from "@/types";
import {Unit} from "@/types";

export default async function allUnits(formData: {token:token}):Promise<Unit[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/Units`, {
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
        localStorage.setItem('token', data.token)
        return data
    } catch (error) {
        console.error('Self info error:', error)
        throw error
    }
}
