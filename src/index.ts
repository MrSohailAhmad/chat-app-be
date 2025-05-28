import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db";
import { authRoutes } from "./routes/auth.routes";
import { globalErrorHandler } from "./middleware/error.middleware";
import { messageRoutes } from "./routes/message.routes";
import { io, server, app } from "./lib/socket";
dotenv.config();
// const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript!");
});

// Test route to verify error handling
app.get("/test-error", (req, res) => {
  throw new Error("This is a test error");
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

// ✅ Catch-all 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use(globalErrorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
