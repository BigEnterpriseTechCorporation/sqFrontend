import {token, Exercise} from "@/types";

export default async function exercise(formData: {token:token, id:string}):Promise<Exercise> {
    try {
        const response = await fetch(`https://rpi.tail707b9c.ts.net/api/v1/Exercises/${formData.id}`, {
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
