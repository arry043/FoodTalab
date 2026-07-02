import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";
import { sendOtp, sendSignupOtp } from "../utils/mail.js";
import {
    authCookieOptions,
    clearAuthCookieOptions,
} from "../config/cookies.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        if (!fullName) {
            return res.status(400).json({ message: "Full name is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!mobile) {
            return res
                .status(400)
                .json({ message: "Mobile number is required" });
        }
        if (!password || password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }
        if (mobile.length < 10) {
            return res
                .status(400)
                .json({ message: "Mobile number must be at least 10 digits" });
        }
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        let userByMobile = await User.findOne({ mobile });
        if (userByMobile) {
            return res
                .status(400)
                .json({ message: "Mobile number already registered" });
        }

        // Email Verification check
        const verifiedRecord = await Otp.findOne({ email, isVerified: true });
        if (!verifiedRecord) {
            return res.status(400).json({ message: "Email has not been verified yet" });
        }

        let user = await User.findOne({ email }); 

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobile,
            role,
        });

        // Clean up OTP record
        await Otp.deleteOne({ email });

        const token = await generateToken(user._id);
        res.cookie("token", token, authCookieOptions);

        return res
            .status(201)
            .json({ data: user, message: "User created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error: signUp", error });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = await generateToken(user._id);

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            data: user,
            message: "SignIn successfully",
        });
    } catch (error) {
        console.error("SIGNIN ERROR:", error);
        return res.status(500).json({ message: "Server Error: signIn", error });
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token", clearAuthCookieOptions);

        return res.status(200).json({
            message: "Logout successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: signOut",
            error,
        });
    }
};

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();
        await sendOtp(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: sendOTP", error });
    }
};

export const varifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (String(user.resetOtp) !== String(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.isOtpVerified = true;
        user.resetOtp = null;
        user.otpExpires = null;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: varifyOTP", error });
    }
};

export const sendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt, isVerified: false },
            { upsert: true, new: true }
        );

        await sendSignupOtp(email, otp);
        return res.status(200).json({ message: "Verification OTP sent successfully" });
    } catch (error) {
        console.error("SEND SIGNUP OTP ERROR:", error);
        return res.status(500).json({ message: "Server Error: sendSignupOTP", error });
    }
};

export const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const record = await Otp.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: "Verification OTP not found or expired" });
        }
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Verification OTP expired" });
        }
        if (String(record.otp) !== String(otp)) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        record.isVerified = true;
        await record.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("VERIFY SIGNUP OTP ERROR:", error);
        return res.status(500).json({ message: "Server Error: verifySignupOTP", error });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res
            .status(200)
            .json({ message: "Your password has been reset successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: resetPassword", error });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName,
                email,
                role: role || "user",
            });
        }

        const token = await generateToken(user._id);

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            data: user,
            message: "Google login successful",
        });
    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);
        return res
            .status(500)
            .json({ message: "Server Error: googleAuth", error });
    }
};
