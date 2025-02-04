import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const VerifyEmail = () => {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify/${token}`)
        setMessage(response.data.message)
        setTimeout(() => navigate("/login"), 3000)
      } catch (error) {
        setError(error.response.data.message || "An error occurred")
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-2 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default VerifyEmail

