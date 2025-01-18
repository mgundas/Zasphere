const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = {
  generateToken,
  authenticateToken
}