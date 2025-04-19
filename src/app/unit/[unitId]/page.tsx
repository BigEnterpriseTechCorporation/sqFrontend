"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import unitAndExercises from '@/hooks/unitAndExercises'
import { UnitWithExercises, Exercise, difficulty } from '@/types'
import UnitTitle from '@/components/unitTitle'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'

// Configuration options for the page
const CONFIG = {
  defaultView: 'list', // 'list' or 'grid'
  pagination: {
    enabled: true,
    exercisesPerPage: 5
  },
  filters: {
    enabled: true,
    showDifficulty: true,
    showType: true
  },
  progressTracking: true,
  showCreationDate: true
}

export default function UnitDetail({ params }: { params: { unitId: string } }) {
  const [unit, setUnit] = useState<UnitWithExercises | null>(null)
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // View state (list or grid)
  const [viewMode, setViewMode] = useState(CONFIG.defaultView)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([])
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null)
  const [typeFilter, setTypeFilter] = useState<number | null>(null)
  
  // Search params for additional configuration options
  const searchParams = useSearchParams()

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        // Get current user info
        const response = await fetch('/api/account/self', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          // Check if user has admin role
          setIsAdmin(userData.data?.role === 'Admin' || userData.data?.isAdmin === true)
        }
      } catch (err) {
        console.error('Failed to check user role:', err)
      }
    }
    
    checkUserRole()
  }, [])

  // Override config from URL parameters if present
  useEffect(() => {
    if (searchParams?.get('view')) {
      setViewMode(searchParams.get('view') as 'list' | 'grid')
    }
    
    const perPage = searchParams?.get('perPage')
    if (perPage && !isNaN(Number(perPage))) {
      CONFIG.pagination.exercisesPerPage = Number(perPage)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('No authentication token found')
          return
        }
        
        // Fetch unit and its exercises
        const unitData = await unitAndExercises({ token, id: params.unitId })
        setUnit(unitData)
        setFilteredExercises(unitData.exercises || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unit details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUnitData()
  }, [params.unitId])

  // Apply filters and pagination
  useEffect(() => {
    if (!unit?.exercises) return
    
    // Apply filters
    let filtered = [...unit.exercises]
    
    if (difficultyFilter !== null) {
      filtered = filtered.filter(ex => ex.difficulty === difficultyFilter)
    }
    
    if (typeFilter !== null) {
      filtered = filtered.filter(ex => ex.type === typeFilter)
    }
    
    setFilteredExercises(filtered)
    
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [unit, difficultyFilter, typeFilter])

  // Update visible exercises based on pagination
  useEffect(() => {
    if (CONFIG.pagination.enabled) {
      const startIndex = (currentPage - 1) * CONFIG.pagination.exercisesPerPage
      const endIndex = startIndex + CONFIG.pagination.exercisesPerPage
      setVisibleExercises(filteredExercises.slice(startIndex, endIndex))
    } else {
      setVisibleExercises(filteredExercises)
    }
  }, [filteredExercises, currentPage])

  const getDifficultyLabel = (diff: number): string => {
    switch (diff) {
      case 0: return 'Easy'
      case 1: return 'Medium'
      case 2: return 'Hard'
      case 3: return 'Ultra-hard'
      default: return 'Unknown'
    }
  }

  const getExerciseTypeLabel = (type: number): string => {
    switch (type) {
      case 0: return 'SelectAnswer'
      case 1: return 'FillMissingWords'
      case 2: return 'ConstructQuery'
      case 3: return 'SimpleQuery'
      case 4: return 'ComplexQuery'
      default: return 'Unknown'
    }
  }

  const clearFilters = () => {
    setDifficultyFilter(null)
    setTypeFilter(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg1 flex justify-center items-center">
        <div className="bg-bg3 p-6 rounded-lg border-2 border-black text-center">
          <p className="text-xl font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-bg1 flex justify-center items-center">
        <div className="bg-bg3 p-6 rounded-lg border-2 border-black text-center">
          <p className="text-xl font-bold">Unit not found</p>
          <Link href="/units" className="mt-4 inline-block bg-white text-gray-800 font-semibold py-2 px-4 rounded-full border-2 border-black">
            Back to Units
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg1">
      <Navigation />
      
      <UnitTitle title={unit.title} />
      
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Unit metadata */}
        <div className="bg-bg2 p-6 rounded-lg shadow-md border-2 border-black mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{unit.title}</h1>
              {CONFIG.showCreationDate && (
                <p className="text-sm mt-1">Created by: {unit.ownerName}</p>
              )}
            </div>
            {CONFIG.progressTracking && unit.exercises.length > 0 && (
              <div className="bg-white px-4 py-2 rounded-lg border border-black">
                <p className="font-semibold">Progress: 0/{unit.exercises.length}</p>
              </div>
            )}
          </div>
          
          <p className="text-lg">{unit.description}</p>
          
          {/* Admin Panel Link - Only shown to admin users */}
          {isAdmin && (
            <div className="mt-4 bg-yellow-50 border border-yellow-400 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Admin:</span> Manage exercises in the admin panel
                </p>
                <Link 
                  href={`/admin/exercises?unitId=${params.unitId}`} 
                  className="bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition text-sm"
                >
                  Manage Exercises
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls for filtering and view mode */}
        {(CONFIG.filters.enabled || unit.exercises.length > 0) && (
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            {CONFIG.filters.enabled && (
              <div className="flex flex-wrap gap-3">
                {CONFIG.filters.showDifficulty && (
                  <select 
                    className="border-2 border-black rounded-md px-3 py-2"
                    value={difficultyFilter === null ? '' : difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">All Difficulties</option>
                    <option value="0">Easy</option>
                    <option value="1">Medium</option>
                    <option value="2">Hard</option>
                    <option value="3">Ultra-hard</option>
                  </select>
                )}
                
                {CONFIG.filters.showType && (
                  <select 
                    className="border-2 border-black rounded-md px-3 py-2"
                    value={typeFilter === null ? '' : typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">All Types</option>
                    <option value="0">SelectAnswer</option>
                    <option value="1">FillMissingWords</option>
                    <option value="2">ConstructQuery</option>
                    <option value="3">SimpleQuery</option>
                    <option value="4">ComplexQuery</option>
                  </select>
                )}
                
                {(difficultyFilter !== null || typeFilter !== null) && (
                  <button 
                    className="border-2 border-black rounded-md px-3 py-2 bg-white hover:bg-gray-100"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                className={`px-3 py-2 border-2 border-black rounded-md ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`px-3 py-2 border-2 border-black rounded-md ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>
        )}
        
        {/* Exercises */}
        {visibleExercises.length === 0 ? (
          <div className="bg-bg2 p-6 rounded-lg border-2 border-black text-center">
            <p className="text-xl">No exercises found</p>
            {(difficultyFilter !== null || typeFilter !== null) && (
              <button 
                className="mt-4 bg-white text-gray-800 font-semibold py-2 px-4 rounded-full border-2 border-black"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
            {isAdmin && (
              <p className="mt-4 text-sm text-gray-600">
                To add exercises to this unit, please use the Admin Panel.
              </p>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
            {visibleExercises.map((exercise) => (
              <div key={exercise.id} className="bg-bg2 p-5 rounded-lg border-2 border-black">
                <Link href={`/exercise/${exercise.id}`} className="block">
                  <h3 className="text-xl font-bold mb-2">{exercise.title}</h3>
                  <p className="mb-3 line-clamp-2">{exercise.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {getExerciseTypeLabel(exercise.type)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {CONFIG.pagination.enabled && filteredExercises.length > CONFIG.pagination.exercisesPerPage && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 border-2 border-black rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="flex items-center px-4">
                <span>{currentPage}/{Math.ceil(filteredExercises.length / CONFIG.pagination.exercisesPerPage)}</span>
              </div>
              
              <button 
                className={`px-4 py-2 border-2 border-black rounded-md ${
                  currentPage >= Math.ceil(filteredExercises.length / CONFIG.pagination.exercisesPerPage) 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage(prev => 
                  Math.min(Math.ceil(filteredExercises.length / CONFIG.pagination.exercisesPerPage), prev + 1)
                )}
                disabled={currentPage >= Math.ceil(filteredExercises.length / CONFIG.pagination.exercisesPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
} 