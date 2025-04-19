import { userLogin, token } from "@/types"
import { API } from '@/utils/api'

interface LoginResponse {
	token: token
}

export default async function login(userData: userLogin): Promise<token> {
	try {
		// For login, we don't have a token yet, so we'll use an empty string
		const emptyToken = ''
		
		const response = await API.auth.login<LoginResponse>(emptyToken, userData)
		
		// Return the token from the response
		return response.token
	} catch (error) {
		console.error('Login error:', error)
		throw error
	}
}
