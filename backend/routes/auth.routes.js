import express from "express";
import {
    signUp,
    signIn,
    signOut,
    sendOTP,
    varifyOTP,
    resetPassword,
    googleAuth,
} from "../controllers/auth.controllers.js";
// const router = express.Router();

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/varify-otp", varifyOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth);

export default authRouter;
