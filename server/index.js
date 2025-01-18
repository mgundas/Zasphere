const express = require("express")
const userRoutes = require("./routes/userRoutes")
const config = require("./config")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const { connectToDatabase } = require("./services/database")

const app = express()

// Middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", userRoutes)

// Connect to Database
connectToDatabase()

const port = config.port || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})