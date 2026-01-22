import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import { GiSunkenEye } from "react-icons/gi";
import { GiEyelashes } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
const ForgotPassword = () => {
    const primaryColor = "#f25a13";
    // const primaryColor="#ff4d2d"
    // const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1 );
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4"
            style={{ backgroundColor: bgColor }}
        >
            <div
                className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 "
                style={{ borderColor: borderColor }}
            >
                <div className="flex items-center justify-between mb-4">
                    <Link to="/signin">
                        <IoIosArrowRoundBack
                            className="size-12"
                            style={{ color: primaryColor }}
                        />
                    </Link>
                    <h1
                        className="text-2xl text-center font-bold mb-2 mt-1.5 text-[${primaryColor}]]"
                        style={{ color: primaryColor }}
                    >
                        Reset Password
                    </h1>
                </div>

                {step == 1 && (
                    <div>
                        {/* Email */}
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-1 font-medium"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                placeholder="Enter Your Email"
                                onChange={(e) => setEmail(e.target?.value)}
                                value={email}
                            />
                        </div>
                        {/* Send OTP button */}
                        <button
                            className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-orange-400 cursor-pointer hover:bg-orange-200"
                            style={{
                                backgroundColor: primaryColor,
                                color: "#fff",
                                hoverColor: "#e24310",
                            }}
                        >
                            Send OTP
                        </button>
                    </div>
                )}

                {step == 2 && (
                    <div>
                        {/* Email */}
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-1 font-medium"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                placeholder="Enter Your Email"
                                value={email}
                                disabled
                            />
                        </div>
                        {/* Enter OTP */}
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-1 font-medium"
                                htmlFor="otp"
                            >
                                OTP
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                placeholder="Enter OTP"
                                onChange={(e) => setOtp(e.target?.value)}
                                value={otp}
                            />
                        </div>
                        {/* Send OTP button */}
                        <button
                            className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-orange-400 cursor-pointer hover:bg-orange-200"
                            style={{
                                backgroundColor: primaryColor,
                                color: "#fff",
                                hoverColor: "#e24310",
                            }}
                        >
                            Submit OTP
                        </button>
                    </div>
                )}

                {step == 3 && (
                    <div>
                        {/* Password */}
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-1 font-medium"
                                htmlFor="newPassword"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                    placeholder="Enter New password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {!showPassword ? (
                                        <GiSunkenEye />
                                    ) : (
                                        <GiEyelashes />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* Confirm New Password */}
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 mb-1 font-medium"
                                htmlFor="confirmNewPassword"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                placeholder="Enter Confirm New Password"
                                onChange={(e) => setConfirmPassword(e.target?.value)}
                                value={confirmPassword}
                            />
                        </div>
                        {/* Send OTP button */}
                        <button
                            className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-orange-400 cursor-pointer hover:bg-orange-200"
                            style={{
                                backgroundColor: primaryColor,
                                color: "#fff",
                                hoverColor: "#e24310",
                            }}
                        >
                            Reset Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
