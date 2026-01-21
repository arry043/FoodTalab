import express from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controllers.js";
const router = express.Router();

const authRouter = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

export default authRouter;