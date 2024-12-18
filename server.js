import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Connection from "./db/connection.js"; // Include the .js extension
import AuthRoutes from "./routes/auth.js";

import UserRouter from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/chat/user", AuthRoutes);
app.use("/chat/users", UserRouter);

app.listen(process.env.PORT, () => {
  Connection();
  console.log("Server is running on port " + process.env.PORT);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
