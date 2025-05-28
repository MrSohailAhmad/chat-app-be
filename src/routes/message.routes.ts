import express from "express";
import { protectedRoutes } from "../middleware/auth.middlerware";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controllers/message.controller";

export const messageRoutes = express.Router();

messageRoutes.post("/", protectedRoutes, sendMessage);
messageRoutes.get("/users", protectedRoutes, getUserForSidebar);
messageRoutes.get("/:id", protectedRoutes, getMessages);
