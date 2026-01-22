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

const SignUp = () => {
    const primaryColor = "#f25a13";
    // const primaryColor="#ff4d2d"
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoader(true);
        if(!fullName){
            setError("Please enter your full name");
        }
        else if(!email){
            setError("Please enter your email");
        }
        else if(!password){
            setError("Please enter your password");
        }
        else if(!mobile){
            setError("Please enter your mobile number");
        }
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                {
                    fullName,
                    email,
                    password,
                    mobile,
                    role,
                },
                { withCredentials: true },
            );
            setError("");
            setLoader(false);
            toast.success("SignUp successful");
        } catch (error) {
            setLoader(false);
            setError(error.response?.data?.message);
            toast.error(error.response?.data?.message);
        }
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const {data} = await axios.post(
                `${serverUrl}/api/auth/google-auth`,
                {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    role: "user",
                },
                { withCredentials: true },
            ); 
            setError("");
            toast.success("SignUp with Google login successful");
        } catch (error) {
            setError(error.response?.data?.message);
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
                    Create your account to continue to remove talab from your
                    plate
                </p>

                {/* fullName */}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 font-medium"
                        htmlFor="fullName"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                        placeholder="Enter Your Full Name"
                        onChange={(e) => setFullName(e.target?.value)}
                        value={fullName}
                        required
                    />
                </div>

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

                {/* Mobile */}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 font-medium"
                        htmlFor="mobile"
                    >
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                        placeholder="7081......"
                        onChange={(e) => setMobile(e.target?.value)}
                        value={mobile}
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

                {/* Role */}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-1 font-medium"
                        htmlFor="role"
                    ></label>
                    <div className="flex gap-2">
                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)} // ✅ yahi magic hai
                                className="flex-1 border border-orange-300 rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                                style={
                                    role === r
                                        ? {
                                              backgroundColor: primaryColor,
                                              color: "#fff",
                                          }
                                        : { backgroundColor: bgColor }
                                }
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
                {/* signup button */}
                <button
                    className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-orange-400 cursor-pointer hover:bg-orange-200"
                    style={{
                        backgroundColor: primaryColor,
                        color: "#fff",
                        hoverColor: "#e24310",
                    }}
                    onClick={handleSignup}
                    disabled={loader}
                >
                    {loader ? <ClipLoader size={20} color="white" /> : "SignUp"}
                </button>

                {error && (
                    <p className="text-red-500 text-center mt-2">{error}</p>
                )}

                <button
                    className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 cursor-pointer hover:bg-[#f25a13] hover:text-white hover:border-[#f25a13]`}
                    onClick={handleGoogleAuth}
                >
                    <span className="text-gray-600 font-medium">
                        Signup with Google
                    </span>
                    <FcGoogle className="w-6 h-6" />
                </button>

                <p className="text-center mt-2 text-gray-600 size-1.2">
                    Already have an account?{" "}
                    <span className={`text-[#f18655]`}>
                        <Link to="/signin">SignIn</Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
