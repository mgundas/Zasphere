const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ip: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Automatically remove expired tokens
  }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

module.exports = RefreshToken