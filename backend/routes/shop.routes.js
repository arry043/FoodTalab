import express from "express";
import { createAndEditShop } from "../controllers/shop.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
// const router = express.Router();

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), createAndEditShop);

export default shopRouter;
