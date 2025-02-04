import User from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendEmail } from "../utils/email.js"
import { catchAsync } from "../utils/catchAsync.js"

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

export const register = catchAsync(async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body

  const existingUser = await User.findOne({ $or: [{ email }, { username }] })
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const verificationToken = crypto.randomBytes(20).toString("hex")

  const newUser = await User.create({
    username,
    firstName,
    lastName,
    email,
    password,
    verificationToken,
  })

  const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`

  await sendEmail({
    email: newUser.email,
    subject: "Verify Your Email",
    message: `Please click this link to verify your email: ${verificationLink}`,
  })

  res.status(201).json({ message: "User registered. Please check your email to verify your account." })
})

export const login = catchAsync(async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ $or: [{ email: username }, { username }] }).select("+password")

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: "Please verify your email before logging in" })
  }

  const token = signToken(user._id)
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } })
})

export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({ verificationToken: token })

  if (!user) {
    return res.status(400).json({ message: "Invalid verification token" })
  }

  user.isVerified = true
  user.verificationToken = undefined
  await user.save()

  res.json({ message: "Email verified successfully" })
})

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const resetToken = crypto.randomBytes(20).toString("hex")
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  await user.save()

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    message: `Please click this link to reset your password: ${resetLink}`,
  })

  res.json({ message: "Password reset email sent" })
})

export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" })
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  res.json({ message: "Password reset successful" })
})

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json(user)
})

