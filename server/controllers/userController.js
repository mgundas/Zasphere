const User = require('../models/userModel')
const { 
  sendVerificationEmail,
  sendVerificationSuccessEmail
} = require('../services/mailgunService')
const crypto = require('crypto')

// Create a new user
const createUserController = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "Please fill out all fields" })
  }

  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existingUser) {
    return res.status(400).json({ message: "Email or username already exists" })
  }

  try {
    const user = new User({ firstName, lastName, username, email, password })

    // Generate a verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    user.verificationCode = verificationCode

    await user.save()

    // Send verification email
    const userData = { firstName, lastName, username, email, verificationCode }
    await sendVerificationEmail(user.email, userData)

    res.status(201).json({ message: "User created successfully. Please check your email for the verification code." })
  } catch (error) {
    res.status(400).json({ message: "Error creating user", "error": error })
  }
}

// Login a user
const loginUserController = async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill out all fields" })
    }
}

// Verify a user
const verifyUserController = async (req, res) => {
    const { email, verificationCode } = req.body
    
    if (!email || !verificationCode) {
        return res.status(400).json({ message: "Please fill out all fields" })
    }

    try {
        const user = await User.findOne({ email, verificationCode })

        if (!user) {
            return res.status(400).json({ message: "Invalid verification code" })
        }

        user.status = 'active'
        user.verificationCode = null

        await user.save()

        sendVerificationSuccessEmail(user.email)
        res.status(200).json({ message: "User verified successfully" })
    } catch (error) {
        res.status(400).json({ message: "Error verifying user", error })
    }
}

module.exports = {
  createUserController,
  loginUserController,
  verifyUserController
}