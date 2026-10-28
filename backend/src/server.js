import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

// Healthcheck endpoint for orchestrators, uptime checks, and load balancers
app.get("/healthz", (_, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStates[mongoose.connection.readyState] || "unknown",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production frontend serving
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // In development, handle unknown API routes gracefully
  app.use("/api/*", notFoundHandler);
}

// Global Centralized Error Handling Middleware
app.use(errorHandler);

const httpServer = server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});

// Graceful Shutdown Handling
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  httpServer.close(async () => {
    console.log("HTTP server closed.");
    try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error disconnecting MongoDB:", err);
      process.exit(1);
    }
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    console.error("Forceful shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
