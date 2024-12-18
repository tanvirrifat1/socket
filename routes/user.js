import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import { GetAllUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", verifyUser, GetAllUser);

export default router;
