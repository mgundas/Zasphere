const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
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
const refreshAccessToken = (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken(user)
    res.json({ accessToken })
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  refreshAccessToken
}