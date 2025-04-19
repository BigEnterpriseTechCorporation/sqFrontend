import { userRegister, token } from "@/types"
import { API } from '@/utils/api'

interface RegisterResponse {
	token: token
}

export default async function register(userData: {userName: string, password: string, fullName:string}): Promise<token> {
	try {
		// For registration, we don't have a token yet, so we'll use an empty string
		const emptyToken = ''
		
		const response = await API.auth.register<RegisterResponse>(emptyToken, userData)
		
		// Return the token from the response
		return response.token
	} catch (error) {
		console.error('Registration error:', error)
		throw error
	}
}
