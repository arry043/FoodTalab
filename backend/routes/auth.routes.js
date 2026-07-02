import express from "express";
import {
    signUp,
    signIn,
    signOut,
    sendOTP,
    varifyOTP,
    resetPassword,
    googleAuth,
    sendSignupOTP,
    verifySignupOTP,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/varify-otp", varifyOTP);
authRouter.post("/send-signup-otp", sendSignupOTP);
authRouter.post("/verify-signup-otp", verifySignupOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth);

export default authRouter;
