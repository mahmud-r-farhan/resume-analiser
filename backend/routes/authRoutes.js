import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

router.post("/register", async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const verificationToken = crypto.randomBytes(20).toString("hex")

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      verificationToken,
    })

    await newUser.save()

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    })

    res.status(201).json({ message: "User registered. Please check your email to verify your account." })
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ $or: [{ email: username }, { username }] })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message })
  }
})

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error: error.message })
  }
})

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `Please click this link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
    })

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    res.status(500).json({ message: "Error sending password reset email", error: error.message })
  }
})

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
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
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message })
  }
})

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message })
  }
})

export default router

