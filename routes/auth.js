import express from "express";
import { Login, Register, verify } from "../controllers/Reg.controller.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", verifyUser, verify);

export default router;
