import { userLogin } from "@/types"

interface data {
	token: string
}

export default async function useLogin(formData: userLogin): Promise<data> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/Account/login`, {
			method: 'POST',
			headers: {
				'accept': '*/*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		localStorage.setItem('token', data.token)
		return data
	} catch (error) {
		console.error('Login error:', error)
		throw error
	}
}
