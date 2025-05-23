import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  update,
  updateProfilePIcture,
} from "../controllers/auth.controller";
import { protectedRoutes } from "../middleware/auth.middlerware";

export const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

authRoutes.patch("/update", protectedRoutes, update);
authRoutes.patch("/update-pic", protectedRoutes, updateProfilePIcture);

authRoutes.get("/check", protectedRoutes, checkAuth);
