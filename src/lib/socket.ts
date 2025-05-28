import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export const getReceiverSocketID = (userId: string) => {
  return userSocketMap[userId];
};

let userSocketMap: any = {};

io.on("connection", (socket) => {
  console.log("User connected...", socket.id);
  const userId = socket.handshake.query.userId as string | undefined;
  if (typeof userId === "string") {
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUser", Object.keys(userSocketMap));
  }
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    if (typeof userId === "string") {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
