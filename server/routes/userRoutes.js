const express = require("express")
const router = express.Router()
const { 
  createUserController,
  loginUserController,
  verifyUserController
} = require("../controllers/userController")

// Post requests
router.post("/user", createUserController)
router.post("/user/verify", verifyUserController)

// Get requests
router.get("/user", loginUserController)

// Put requests

// Delete requests

module.exports = router