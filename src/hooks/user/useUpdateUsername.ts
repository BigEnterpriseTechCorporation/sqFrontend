import { useState } from 'react'
import self from '@/hooks/auth/self'
import { User } from '@/types'

export default function useUpdateUsername() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const updateUsername = async (
    username: string, 
    password: string
  ): Promise<User> => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: username,
          currentPassword: password
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to update username')
      }
      
      // Refresh user data
      const userData = await self({ token })
      setSuccess('Username updated successfully')
      return userData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update username'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUsername,
    isLoading,
    error,
    success,
    clearMessages: () => {
      setError(null)
      setSuccess(null)
    }
  }
} 