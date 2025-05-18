import express from "express";
import { login, logout, signup, update } from "../controllers/auth.controller";

export const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

authRoutes.patch("/update", update);
