import { useState } from 'react'
import { User } from "@/types"
import Link from "next/link"

interface UserCardProps {
  user: User
  onUpdateUsername: (newUsername: string, password: string) => Promise<void>
}

export default function UserCard({ user, onUpdateUsername }: UserCardProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(user.userName)
  const [currentPassword, setCurrentPassword] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setUpdateSuccess(null)
      setUpdateError(null)
      
      if (!newUsername.trim()) {
        setUpdateError("Username cannot be empty")
        return
      }
      
      if (!currentPassword) {
        setUpdateError("Current password is required to change username")
        return
      }
      
      await onUpdateUsername(newUsername, currentPassword)
      
      setIsEditingUsername(false)
      setCurrentPassword("") // Clear password
      setUpdateSuccess("Username updated successfully")
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update username')
    }
  }
  
  const cancelEditing = () => {
    setIsEditingUsername(false)
    setUpdateError(null)
    setNewUsername(user.userName)
    setCurrentPassword("")
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
      <h1 className="text-4xl font-bold mb-8">{user.fullName}</h1>
      
      {updateSuccess && (
        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-lg">
          {updateSuccess}
        </div>
      )}
      
      {updateError && (
        <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-lg">
          {updateError}
        </div>
      )}
      
      <div className="space-y-10">
        <div className="flex justify-between">
          <div>
            <h2 className="text-gray-500 text-lg mb-2">Username</h2>
            {!isEditingUsername ? (
              <div className="flex items-center gap-3">
                <p className="text-xl font-medium">{user.userName}</p>
                <button 
                  onClick={() => setIsEditingUsername(true)}
                  className="text-purple-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateUsername} className="mt-2 w-full">
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-1">New Username</label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 w-full"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    className="border rounded-lg px-3 py-2 w-full"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your password to verify"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-gray-500 text-lg mb-2">Role</h2>
            <span className={`inline-block px-4 py-1 rounded-full text-base font-medium ${
              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Account Information</h2>
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="text-gray-500 text-lg mb-2">User ID</h3>
            <p className="text-gray-900 font-mono">{user.id}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8 flex justify-center">
          {user.role === 'Admin' && (
            <Link 
              href="/admin" 
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl text-center inline-block transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 