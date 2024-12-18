import { Server } from "socket.io";

import http from "http";

import express from "express";

const app = express();

const onlineUsers = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const GetReceiverSocketId = (socketId) => {
  return onlineUsers[socketId];
};

io.on("connection", (socket) => {
  socket.on("join", (receiverId) => {
    onlineUsers[receiverId] = socket.id;
  });
});

export { app, server, io };
