import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);

// Basic Route for testing
app.get("/", (req, res) => {
  res.send("CodeMates API is running...");
});

// Database Connection
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => console.log("❌ DB Error: ", err));
