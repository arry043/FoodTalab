import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
// const router = express.Router();

const userRouter = express.Router();


userRouter.get("/current/", isAuth, signOut);

export default userRouter;
