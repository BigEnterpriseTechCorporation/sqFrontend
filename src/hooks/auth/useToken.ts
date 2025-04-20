import { token } from "@/types"

/**
 * Hook to handle token operations
 * @returns Object with token-related methods
 */
export default function useToken() {
  /**
   * Get the current token from localStorage
   * @returns The token or null if not found
   */
  const getToken = (): token | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  /**
   * Check if a valid token exists
   * @returns Boolean indicating if token exists
   */
  const hasToken = (): boolean => {
    return !!getToken()
  }

  /**
   * Set a token in localStorage
   * @param newToken The token to store
   */
  const setToken = (newToken: token): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('token', newToken)
  }

  /**
   * Remove the token from localStorage
   */
  const removeToken = (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
  }

  return {
    getToken,
    hasToken,
    setToken,
    removeToken
  }
} 