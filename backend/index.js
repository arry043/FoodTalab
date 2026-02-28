import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN, // http://localhost:5173
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
})

app.set("io", io); // Make io accessible in routes via req.app.get("io")

const PORT = process.env.PORT;

// middleware
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // http://localhost:5173
    credentials: true
}));

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
