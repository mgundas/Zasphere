const mongoose = require("mongoose")
const config = require("../config")

const connectToDatabase = async () => {
  const uri = `mongodb+srv://${config.db.username}:${config.db.password}@${config.db.clusterUrl}/${config.db.name}?retryWrites=true&w=majority&appName=Development`
  
  try {
    await mongoose.connect(uri)
    console.log("Connected to the database")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

module.exports = { connectToDatabase }