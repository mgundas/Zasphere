const express = require('express')
const { createUserController, loginUserController, verifyUserController, revokeTokenController } = require('../controllers/userController')
const { authenticateToken, refreshAccessToken } = require('../services/authService')
const { loginLimiter } = require('../middlewares/rateLimiter')

const router = express.Router()

router.post('/user/register', createUserController)
router.post('/user/verify', verifyUserController)
router.post('/user/login', loginLimiter, loginUserController)
router.post('/user/token', loginLimiter, refreshAccessToken)
router.post('/user/revoke', revokeTokenController)

// Protected routes
router.get('/user/protected', authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

module.exports = router