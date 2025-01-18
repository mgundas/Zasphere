const express = require("express");
const userRoutes = require("./routes/userRoutes");
const config = require("./config");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { connectToDatabase } = require("./services/database");
const passport = require("passport");
const session = require("express-session");
const { generalLimiter } = require("./middlewares/rateLimiter");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiting middleware to all routes
app.use(generalLimiter);

// Routes
app.use("/api", userRoutes);

// Connect to Database
connectToDatabase();

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
