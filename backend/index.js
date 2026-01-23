import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";


dotenv.config();

const app = express();
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


// server start
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on port ${PORT}`);
});
