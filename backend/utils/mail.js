import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "Gmail",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});


export const sendOtp = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "OTP Verification for Forgot Password of FoodTalab",
        text: `Your OTP is ${otp} for resetting your password. Please don't share it with anyone. \n \n If you didn't request this, please ignore this email. \n \n This OTP will expire in 5 minutes.`,
    })
}

