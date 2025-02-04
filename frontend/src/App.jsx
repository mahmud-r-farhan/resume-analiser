import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"
import VerifyEmail from "./components/VerifyEmail"
import Profile from "./components/Profile"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

