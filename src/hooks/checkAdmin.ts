import { token } from "@/types";
import { API } from '@/utils/api';

export default async function checkAdmin(formData: {token: token}): Promise<boolean> {
  try {
    // Get the user's information using the token
    const user = await API.auth.self(formData.token);
    
    // Check if the user has admin role
    return user.role === 'Admin';
  } catch (error) {
    console.error('Admin check error:', error);
    // If there's an error, default to no admin access
    return false;
  }
} 