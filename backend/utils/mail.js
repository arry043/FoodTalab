import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sendOtp = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "OTP Verification for Forgot Password of FoodTalab",
            text: `Your OTP is ${otp} for resetting your password. Please don't share it with anyone. \n \n If you didn't request this, please ignore this email. \n \n This OTP will expire in 5 minutes.`,
        });
        console.log("OTP email sent to:", to);
    } catch (error) {
        console.error("MAIL ERROR:", error);
        throw error; // controller ko pata chale
    }
};
