// Import required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import custom modules and middleware
import dbConnection from "./src/database/dbConnection.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
import { AppError } from "./src/utils/AppError.js";

// Import route modules
import authRoute from "./src/modules/auth/auth.route.js";
import donationRoute from "./src/modules/donation/dontaion.route.js";
import addictionRoute from "./src/modules/addection/addection.route.js";
import donateRoute from "./src/modules/donate/donate.route.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Configure CORS middleware
app.use(
  cors({
    origin: [
      "https://donation-platform-f450f.web.app",
      "https://donation-platform-f450f.firebaseapp.com",
      "http://localhost:5173",
      "http://192.168.1.4:5173",
    ],
    credentials: true,
  })
);

// Configure middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome To Donation Backend Code!</h1>");
});

// Register API routes
app.use("/api/auth", authRoute);
app.use("/api/donation", donationRoute);
app.use("/api/addiction", addictionRoute);
app.use("/api/donate", donateRoute);

//Undefined Routes Handling
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error Handling Middleware
app.use(globalErrorHandler);

//Database Connection
dbConnection();

//Server Startup
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});