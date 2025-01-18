const express = require("express")
const router = express.Router()
const { 
  createUserController,
  loginUserController,
  verifyUserController
} = require("../controllers/userController")
const { authenticateToken } = require('../services/authService')
const { loginLimiter } = require("../middlewares/rateLimiter");


// Post requests
router.post("/user/register", createUserController)
router.post("/user/verify", verifyUserController)
router.post("/user/login", loginLimiter, loginUserController)

// Get requests

// Put requests

// Delete requests

// Example of a protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

module.exports = router