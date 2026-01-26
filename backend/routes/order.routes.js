import express from "express";
import { getOwnerOrders, getUserOrders, placeOrder } from "../controllers/order.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/user-orders", isAuth, getUserOrders);
orderRouter.get("/owner-orders ", isAuth, getOwnerOrders);


export default orderRouter;
