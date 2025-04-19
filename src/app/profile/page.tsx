"use client"

import { useState, useEffect } from "react"
import { User } from "@/types"
import self from "@/hooks/self"
import userProgress, { UserProgress } from "@/hooks/userProgress"
import useUpdateUsername from "./hooks/useUpdateUsername"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import UserCard from "./components/UserCard"
import ProgressDisplay from "./components/ProgressDisplay"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorDisplay from "./components/ErrorDisplay"

export default function ProfilePage() {
  // User data state
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Progress data state
  const [progressLoading, setProgressLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  
  // Custom hook for updating username
  const { updateUsername } = useUpdateUsername()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('No authentication token found')
          window.location.href = "/login"
          return
        }
        
        // Fetch user profile data
        const userData = await self({ token })
        setUser(userData)
        
        // Once we have the user data, fetch their progress
        await fetchUserProgress(token)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])
  
  const fetchUserProgress = async (token: string) => {
    setProgressLoading(true)
    try {
      // Fetch progress data
      const progressData = await userProgress({ token })
      
      // Apply data safeguards before setting state
      const safeProgressData = {
        ...progressData,
        totalExercises: progressData.totalExercises || 0,
        completedExercises: progressData.completedExercises || 0,
        completionRate: 
          typeof progressData.completionRate === 'number' && !isNaN(progressData.completionRate)
            ? progressData.completionRate
            : (progressData.totalExercises > 0 
                ? progressData.completedExercises / progressData.totalExercises 
                : 0),
        exercisesByDifficulty: progressData.exercisesByDifficulty || {},
        exercisesByType: progressData.exercisesByType || {},
        lastCompletedExercises: progressData.lastCompletedExercises || [],
        completedByDifficulty: progressData.completedByDifficulty || {}
      }
      
      setProgress(safeProgressData)
    } catch (err) {
      console.error('Failed to fetch progress:', err)
      // Set a default safe progress object if fetch fails
      setProgress({
        totalExercises: 0,
        completedExercises: 0,
        completionRate: 0,
        exercisesByDifficulty: {},
        exercisesByType: {},
        lastCompletedExercises: [],
        completedByDifficulty: {}
      })
    } finally {
      setProgressLoading(false)
    }
  }
  
  const handleUpdateUsername = async (newUsername: string, password: string) => {
    try {
      const updatedUser = await updateUsername(newUsername, password)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      // Error is handled by the useUpdateUsername hook and UserCard component
      throw error
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen size="large" />
  }

  // Error state
  if (error) {
    return <ErrorDisplay message={error} />
  }

  // Main content
  return (
    <div className="min-h-screen bg-pink-200 flex flex-col">
      <Navigation />
      <div className="flex justify-center py-16 px-4 flex-grow">
        <div className="w-full max-w-4xl">
          {user && (
            <UserCard 
              user={user} 
              onUpdateUsername={handleUpdateUsername} 
            />
          )}
          
          <ProgressDisplay 
            progress={progress} 
            isLoading={progressLoading}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
} 