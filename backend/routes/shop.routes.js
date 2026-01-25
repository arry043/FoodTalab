import express from "express";
import { createAndEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
// const router = express.Router();

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), createAndEditShop);
shopRouter.get("/myshop", isAuth, getMyShop );
shopRouter.get("/getbycity/:city", isAuth, getShopByCity );

export default shopRouter;
