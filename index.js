// Import required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables FIRST
dotenv.config();

// Import custom modules and middleware
import dbConnection from "./src/database/dbConnection.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
import { AppError } from "./src/utils/AppError.js";

// Import route modules
import authRoute from "./src/modules/auth/auth.route.js";
import donationRoute from "./src/modules/donation/dontaion.route.js";
import addictionRoute from "./src/modules/addection/addection.route.js";
import donateRoute from "./src/modules/donate/donate.route.js";

// Initialize Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://donation-platform-f450f.firebaseapp.com",
      "http://localhost:5173",
      "http://192.168.1.4:5173",
    ],
    credentials: true,
  })
);

// Home Route
app.get("/", (req, res) => {
  res.send("<h1>Welcome To Donation Backend Code!</h1>");
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/donation", donationRoute);
app.use("/api/addiction", addictionRoute);
app.use("/api/donate", donateRoute);

// Undefined Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(globalErrorHandler);

// Connect Database
dbConnection();

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${port}`);
});