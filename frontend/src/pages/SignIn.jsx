import { useState } from "react";
import { GiSunkenEye } from "react-icons/gi";
import { GiEyelashes } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
    const primaryColor = "#f25a13";
    // const primaryColor="#ff4d2d"
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();


    const handleSignin = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signin`,
                {
                    email,
                    password,
                },
                { withCredentials: true },
            );
            // console.log(result);
            dispatch(setUserData(result?.data));
            toast.success("SignIn successful");
            setError("");
            setLoader(false);
        } catch (error) {
            setLoader(false);
            setError(error.response?.data?.message);
            toast.error(error.response?.data?.message);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const { data } = await axios.post(
                `${serverUrl}/api/auth/google-auth`,
                {
                    email: result.user.email,
                },
                { withCredentials: true },
            );
            dispatch(setUserData(data));
            toast.success("SignIn with Google login successful");
            // console.log(result);
            // console.log(data);
        } catch (error) {
            console.log("Google Auth Error:", error.response?.data || error);
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
                <h1
                    className="text-3xl text-center font-bold mb-2 text-[${primaryColor}]]"
                    style={{ color: primaryColor }}
                >
                    FoodTalab
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    Welcome back! Please sign in to your account. Order
                    delicious food from your favorite restaurants.
                </p>

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
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 font-medium"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {!showPassword ? <GiSunkenEye /> : <GiEyelashes />}
                        </button>
                    </div>
                </div>

                {/* forgot password */}
                <div className="flex flex-row-reverse mr-1">
                    <Link
                        to="/forgot-password"
                        className="text-[#f18655] text-sm"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* signin button */}
                <button
                    className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-orange-400 cursor-pointer hover:bg-orange-200"
                    style={{
                        backgroundColor: primaryColor,
                        color: "#fff",
                        hoverColor: "#e24310",
                    }}
                    onClick={handleSignin}
                    disabled={loader}
                >
                    {loader ? <ClipLoader size={20} color="white" /> : "SignIn"}
                </button>

                {error && (
                    <p className="text-red-500 text-center mt-2">{error}</p>
                )}


                {/* google signin */}
                <button
                    className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 cursor-pointer hover:bg-[#f25a13] hover:text-white hover:border-[#f25a13]`}
                    onClick={handleGoogleAuth}
                >
                    <span className="text-gray-600 font-medium">
                        Signin with Google
                    </span>
                    <FcGoogle className="w-6 h-6" />
                </button>

                <p className="text-center mt-2 text-gray-600 size-1.2">
                    Want to create a new account?{" "}
                    <span className={`text-[#f18655]`}>
                        <Link to="/signup">SignUp</Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
