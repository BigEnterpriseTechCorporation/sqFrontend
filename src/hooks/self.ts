import { token, User } from "@/types";
import { API } from '@/utils/api';

export default async function self(formData: {token:token}): Promise<User> {
	try {
		return await API.auth.self<User>(formData.token);
	} catch (error) {
		console.error('Self info error:', error);
		throw error;
	}
}
 