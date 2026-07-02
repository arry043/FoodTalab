import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import { corsOptions } from "./config/cors.js";

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.set("io", io); // Make io accessible in routes via req.app.get("io")

const PORT = process.env.PORT || 8000;

// middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter); 
app.use("/api/user", userRouter); 
app.use("/api/shop", shopRouter); 
app.use("/api/item", itemRouter); 
app.use("/api/order", orderRouter); 



// socket handler
socketHandler(io);
// server start
server.listen(PORT, () => {
    connectDB();
    console.log(`Server started on port ${PORT}`);
});
