"use client"

import { useState, useEffect } from "react"
import {User, UserProgress} from "@/types"
import Navigation from "@/components/layout/Navigation"
import self from "@/hooks/auth/self"
import userProgress from "@/hooks/content/userProgress"
import useUpdateUsername from "@/hooks/user/useUpdateUsername"
import useUpdateFullName from "@/hooks/user/useUpdateFullName"
import Footer from "@/components/layout/Footer"
import UserCard from "@/components/Profile/UserCard"
import ProgressDisplay from "@/components/Profile/ProgressDisplay"
import LoadingSpinner from "@/components/Profile/LoadingSpinner"
import ErrorDisplay from "@/components/Profile/ErrorDisplay"

export default function ProfilePage() {
  // User data state
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Progress data state
  const [progressLoading, setProgressLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  
  // Custom hooks for updating user information
  const { updateUsername } = useUpdateUsername()
  const { updateFullName } = useUpdateFullName()

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
        userId: progressData.userId || '',
        username: progressData.username || '',
        totalExercises: progressData.totalExercises || 0,
        solvedExercises: progressData.solvedExercises || 0,
        totalAttempts: progressData.totalAttempts || 0,
        likedUnits: progressData.likedUnits || 0,
        completionPercentage: 
          typeof progressData.completionPercentage === 'number' && !isNaN(progressData.completionPercentage)
            ? progressData.completionPercentage
            : 0,
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
        userId: '',
        username: '',
        totalExercises: 0,
        solvedExercises: 0,
        totalAttempts: 0,
        likedUnits: 0,
        completionPercentage: 0,
        exercisesByDifficulty: {},
        exercisesByType: {},
        lastCompletedExercises: [],
        completedByDifficulty: {}
      })
    } finally {
      setProgressLoading(false)
    }
  }
  
  const handleUpdateUsername = async (newUsername: string, password: string): Promise<User> => {
    try {
      const updatedUser = await updateUsername(newUsername, password)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      // Error is handled by the useUpdateUsername hook and UserCard component
      throw error
    }
  }
  
  const handleUpdateFullName = async (newFullName: string, password: string): Promise<User> => {
    try {
      const updatedUser = await updateFullName(newFullName, password)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      // Error is handled by the useUpdateFullName hook and UserCard component
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
    <div className="min-h-screen bg-bg1 flex flex-col">
      <Navigation />
      <div className="flex justify-center py-16 px-4 flex-grow">
        <div className="w-full max-w-4xl">
          {user && (
            <UserCard 
              user={user} 
              onUpdateUsername={handleUpdateUsername}
              onUpdateFullName={handleUpdateFullName}
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