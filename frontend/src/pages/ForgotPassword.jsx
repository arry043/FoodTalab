import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import { GiSunkenEye } from "react-icons/gi";
import { GiEyelashes } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
    const primaryColor = "#f25a13";
    // const primaryColor="#ff4d2d"
    // const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);


    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/send-otp`,
                {
                    email,
                },
                { withCredentials: true },
            );
            console.log(result);
            setStep(2);
            alert(
                "Otp sent successfully, please check your email and enter the otp",
            );
            setError("");
            setLoader(false);
            toast.success("Otp sent successfully");
        } catch (error) {
            setLoader(false);
            setError(error.response?.data?.message);
            toast.error(error.response?.data?.message);
        }
    };

    const handleVarifyOtp = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/varify-otp`,
                {
                    email,
                    otp,
                },
                { withCredentials: true },
            );
            console.log(result);
            toast.success("Otp varified successfully");
            setStep(3);
            setError("");
            setLoader(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setLoader(false);
            toast.error(error.response?.data?.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoader(true);
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            setLoader(false);
            return;
        }
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/reset-password`,
                {
                    email,
                    newPassword,
                },
                { withCredentials: true },
            );
            console.log(result);
            toast.success("Password reset successful");
            alert("Password reset successful");
            navigate("/signin");
            setError("");
            setLoader(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setLoader(false);
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4"
            style={{ backgroundColor: bgColor }}
        >
            <ToastContainer />
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
                            onClick={handleSendOtp}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader size={20} color="white" /> : "Send OTP"}
                        </button>
                        {error && (
                            <p className="text-red-500 text-center mt-2">
                                {error}
                            </p>
                        )}
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
                            onClick={handleVarifyOtp}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
                        </button>
                        {error && (
                            <p className="text-red-500 text-center mt-2">
                                {error}
                            </p>
                        )}
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
                                onChange={(e) =>
                                    setConfirmPassword(e.target?.value)
                                }
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
                            onClick={handleResetPassword}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader size={20} color="white" /> : "Reset Password"}
                        </button>
                        {error && (
                            <p className="text-red-500 text-center mt-2">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
