import express from "express";
import { protectedRoutes } from "../middleware/auth.middlerware";
import { sendMessage } from "../controllers/message.controller";

export const messageRoutes = express.Router();

messageRoutes.post("/", protectedRoutes, sendMessage);
