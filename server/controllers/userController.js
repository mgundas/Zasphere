const User = require('../models/userModel')
const { 
  sendVerificationEmail,
  sendVerificationSuccessEmail
} = require('../services/mailgunService')
const crypto = require('crypto')
const { generateAccessToken, generateRefreshToken } = require('../services/authService')
const passport = require('../config/passportConfig')

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
    await sendVerificationEmail(userData)

    res.status(201).json({ message: "User created successfully. Please check your email for the verification code." })
  } catch (error) {
    res.status(400).json({ message: "Error creating user", "error": error })
  }
}

// Login a user
const loginUserController = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error(err)
      return next(err)
    }
    if (!user) {
      return res.status(400).json({ message: info.message })
    }

    if (user.status === "inactive") {
      return res.status(400).json({ message: "Please verify your email to login" })
    }

    const ip = req.ip
    const userAgent = req.get('User-Agent')

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user, ip, userAgent)
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    res.json({ accessToken })
  })(req, res, next)
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

// Revoke a refresh token
const revokeTokenController = async (req, res) => {
  await revokeRefreshToken(req, res)
}

module.exports = {
  createUserController,
  loginUserController,
  verifyUserController,
  revokeTokenController
}