import { token } from "@/types"

interface data {
	token: string
}

export default async function useSelf(formData: {token:token}): Promise<data> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/Account/self`, {
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
 