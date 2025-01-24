const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const RefreshToken = require('../models/refreshTokenModel')
require("dotenv").config()

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME })
}

// Generate Refresh Token and store it in the database
const generateRefreshToken = async (user, ip, userAgent) => {
  const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME })
  const newRefreshToken = new RefreshToken({ token: refreshToken, userId: user._id, ip, userAgent })
  await newRefreshToken.save()
  return refreshToken
}

// Authenticate Access Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const storedToken = await RefreshToken.findOne({ token, userId: decoded.id })
    if (!storedToken) return res.sendStatus(403)

    const user = await User.findById(decoded.id)
    if (!user) return res.sendStatus(403)

    const accessToken = generateAccessToken(user)
    res.json({ accessToken })
  } catch (err) {
    res.sendStatus(403)
  }
}

// Revoke Refresh Token
const revokeRefreshToken = async (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    await RefreshToken.findOneAndDelete({ token, userId: decoded.id })
    res.sendStatus(204)
  } catch (err) {
    res.sendStatus(403)
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  refreshAccessToken,
  revokeRefreshToken
}