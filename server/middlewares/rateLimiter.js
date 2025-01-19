const rateLimit = require('express-rate-limit')
require("dotenv").config()

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.GENERAL_RATE_LIMIT,
  message: 'Too many requests from this IP, please try again after 15 minutes'
})

// Message sending rate limiting
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.MESSAGE_RATE_LIMIT,
  message: 'Too many messages sent, please try again after a minute'
})

// Login attempts rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.LOGIN_RATE_LIMIT,
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
})

module.exports = {
  generalLimiter,
  messageLimiter,
  loginLimiter
}