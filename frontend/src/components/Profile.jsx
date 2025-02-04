import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
      } catch (error) {
        setError("Error fetching profile")
        console.error(error)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">User Profile</h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1">{user.username}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1">{user.firstName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1">{user.lastName}</div>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

