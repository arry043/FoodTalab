import express from "express";
import { signUp, signIn, signOut, sendOTP, varifyOTP, resetPassword } from "../controllers/auth.controllers.js";
// const router = express.Router();

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/varify-otp", varifyOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;