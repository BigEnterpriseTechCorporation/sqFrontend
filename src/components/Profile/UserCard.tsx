import { useState } from 'react'
import { UserCardProps } from "@/types/components"
import useChangePassword from '@/hooks/user/useChangePassword'
import { Eye, EyeOff } from 'lucide-react'

export default function UserCard({ user, onUpdateUsername, onUpdateFullName }: UserCardProps) {
  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(user.userName)
  const [currentPassword, setCurrentPassword] = useState("")
  
  // Full name editing state
  const [isEditingFullName, setIsEditingFullName] = useState(false)
  const [newFullName, setNewFullName] = useState(user.fullName)
  const [passwordForFullName, setPasswordForFullName] = useState("")
  
  // Global state
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Password changing state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Password change hook
  const { changePassword, error: passwordChangeError, success: passwordChangeSuccess } = useChangePassword()

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
  
  const handleUpdateFullName = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setUpdateSuccess(null)
      setUpdateError(null)
      
      if (!newFullName.trim()) {
        setUpdateError("Full name cannot be empty")
        return
      }
      
      if (!passwordForFullName) {
        setUpdateError("Current password is required to change full name")
        return
      }
      
      await onUpdateFullName(newFullName, passwordForFullName)
      
      setIsEditingFullName(false)
      setPasswordForFullName("") // Clear password
      setUpdateSuccess("Full name updated successfully")
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update full name')
    }
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate passwords
      if (!currentPasswordForChange) {
        setUpdateError("Current password is required")
        return
      }
      
      if (!newPassword || !confirmNewPassword) {
        setUpdateError("Both new password and confirmation are required")
        return
      }
      
      if (newPassword !== confirmNewPassword) {
        setUpdateError("New passwords don't match")
        return
      }
      
      if (newPassword.length < 8) {
        setUpdateError("New password must be at least 8 characters long")
        return
      }
      
      // Call password change function
      await changePassword(currentPasswordForChange, newPassword)
      
      // Reset form
      setIsChangingPassword(false)
      setCurrentPasswordForChange("")
      setNewPassword("")
      setConfirmNewPassword("")
      setUpdateSuccess("Password changed successfully")
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to change password')
    }
  }
  
  const cancelEditing = () => {
    setIsEditingUsername(false)
    setUpdateError(null)
    setNewUsername(user.userName)
    setCurrentPassword("")
  }
  
  const cancelEditingFullName = () => {
    setIsEditingFullName(false)
    setUpdateError(null)
    setNewFullName(user.fullName)
    setPasswordForFullName("")
  }
  
  const cancelPasswordChange = () => {
    setIsChangingPassword(false)
    setUpdateError(null)
    setCurrentPasswordForChange("")
    setNewPassword("")
    setConfirmNewPassword("")
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
      <h1 className="text-4xl font-bold mb-8">
        {!isEditingFullName ? (
          <div className="flex items-center gap-3">
            <span>{user.fullName}</span>
            <button 
              onClick={() => setIsEditingFullName(true)}
              className="text-purple-600 text-sm hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateFullName} className="space-y-3 mt-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">New Full Name</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 w-full text-base"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1">Current Password</label>
              <input
                type="password"
                className="border rounded-lg px-3 py-2 w-full text-base"
                value={passwordForFullName}
                onChange={(e) => setPasswordForFullName(e.target.value)}
                placeholder="Enter your password to verify"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelEditingFullName}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </h1>
      
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
      
      {passwordChangeSuccess && (
        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-lg">
          {passwordChangeSuccess}
        </div>
      )}
      
      {passwordChangeError && (
        <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-lg">
          {passwordChangeError}
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
              <form onSubmit={handleUpdateUsername} className="space-y-3 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">New Username</label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 w-full text-base"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    className="border rounded-lg px-3 py-2 w-full text-base"
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
        </div>
        
        {/* Password Change Form */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-gray-500 text-lg">Password</h2>
            {!isChangingPassword ? (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="text-purple-600 text-sm hover:underline"
              >
                Change Password
              </button>
            ) : (
              <button 
                onClick={cancelPasswordChange}
                className="text-purple-600 text-sm hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
          
          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Current Password</label>
                <input
                  type="password"
                  className="border rounded-lg px-3 py-2 w-full text-base"
                  value={currentPasswordForChange}
                  onChange={(e) => setCurrentPasswordForChange(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="border rounded-lg px-3 py-2 w-full text-base pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="border rounded-lg px-3 py-2 w-full text-base pr-10"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Logout button */}
        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
} 