import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import {
    LuBike,
    LuEye,
    LuEyeOff,
    LuLock,
    LuMail,
    LuPhone,
    LuStore,
    LuUser,
    LuUtensils,
    LuArrowLeft,
    LuCheck,
} from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../firebase";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../config/api";

const roleOptions = [
    { value: "user", label: "Customer", icon: LuUtensils },
    { value: "owner", label: "Shop owner", icon: LuStore },
    { value: "deliveryBoy", label: "Delivery", icon: LuBike },
];

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const [googleLoader, setGoogleLoader] = useState(false);

    // Signup Steps: 1 = Email & Role, 2 = Verify OTP, 3 = Name & Details
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const dispatch = useDispatch();

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    // ──────────── Step 1: Send OTP ────────────
    const handleSendOTP = async (e) => {
        e?.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setLoader(true);
        setError("");
        try {
            await axios.post(`${serverUrl}/api/auth/send-signup-otp`, { email });
            toast.success("Verification OTP sent to your email");
            setStep(2);
            setResendTimer(60);
            setTimeout(() => otpRefs[0].current?.focus(), 200);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to send verification code.";
            setError(message);
            toast.error(message);
        } finally {
            setLoader(false);
        }
    };

    // ──────────── Step 2: Verify OTP ────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError("");

        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (pasted.length === 4) {
            setOtp(pasted.split(""));
            otpRefs[3].current?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e?.preventDefault();
        const otpString = otp.join("");
        if (otpString.length < 4) {
            setError("Please enter the 4-digit verification code.");
            return;
        }

        setLoader(true);
        setError("");
        try {
            await axios.post(`${serverUrl}/api/auth/verify-signup-otp`, {
                email,
                otp: Number(otpString),
            });
            toast.success("Email verified successfully");
            setStep(3);
        } catch (err) {
            const message = err.response?.data?.message || "Invalid or expired OTP";
            setError(message);
            toast.error(message);
            setOtp(["", "", "", ""]);
            otpRefs[0].current?.focus();
        } finally {
            setLoader(false);
        }
    };

    // ──────────── Step 3: Complete Register ────────────
    const validateDetails = () => {
        if (!fullName.trim()) return "Please enter your full name.";
        if (mobile.trim().length < 10) return "Mobile number must be at least 10 digits.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return "";
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const validationError = validateDetails();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoader(true);
        setError("");
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { fullName, email, password, mobile, role },
                { withCredentials: true },
            );
            dispatch(setUserData(result?.data));
            toast.success("Account created successfully");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoader(false);
        }
    };

    // ──────────── Google Signup ────────────
    const handleGoogleAuth = async () => {
        setGoogleLoader(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const { data } = await axios.post(
                `${serverUrl}/api/auth/google-auth`,
                {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    role,
                },
                { withCredentials: true },
            );
            dispatch(setUserData(data));
            toast.success("Account ready with Google");
        } catch (error) {
            const message =
                error.response?.data?.message || "Google sign up failed";
            setError(message);
            toast.error(message);
        } finally {
            setGoogleLoader(false);
        }
    };

    return (
        <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] panel md:grid-cols-[0.9fr_1.1fr]">
                {/* Left Panel */}
                <div className="hidden bg-gradient-to-br from-[#19120f] to-[#2d1a11] p-10 text-white md:flex md:flex-col md:justify-between">
                    <Link to="/" className="text-3xl font-black text-[#ff7a36]">
                        FoodTalab
                    </Link>
                    <div>
                        <p className="text-sm font-black uppercase tracking-wide text-orange-200">
                            Join the table
                        </p>
                        <h1 className="mt-3 text-4xl font-black leading-tight">
                            Customers, kitchens, and delivery partners in one flow.
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/70">
                            Create an account to order food, manage your shop,
                            or accept deliveries.
                        </p>
                    </div>
                    <p className="text-xs text-white/45">
                        Google signup doesn't require email verification.
                    </p>
                </div>

                {/* Right Panel Form wrapper */}
                <div className="p-6 sm:p-8 md:p-10">
                    <Link
                        to="/"
                        className="mb-8 inline-block text-3xl font-black text-[#ff4d2d] md:hidden"
                    >
                        FoodTalab
                    </Link>

                    {/* Step indicator header */}
                    <div className="mb-6 flex items-center justify-between border-b border-orange-50 pb-3 text-xs font-black uppercase tracking-widest text-gray-400">
                        <span className={step >= 1 ? "text-[var(--brand)]" : ""}>1. Email</span>
                        <span className={step >= 2 ? "text-[var(--brand)]" : ""}>2. Verify</span>
                        <span className={step >= 3 ? "text-[var(--brand)]" : ""}>3. Details</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Step 1: Email & Role Selection ── */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSendOTP}
                            >
                                <h2 className="text-3xl font-black text-gray-950">
                                    Create account
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Select your role and enter your email address.
                                </p>

                                <div className="mt-6 grid grid-cols-3 gap-2">
                                    {roleOptions.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setRole(value)}
                                            className={`rounded-2xl border px-2 py-3 text-xs font-black transition ${
                                                role === value
                                                    ? "border-[#ff4d2d] bg-orange-50 text-[#ff4d2d] shadow-sm shadow-orange-100"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                                            }`}
                                        >
                                            <Icon className="mx-auto mb-1 size-5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={handleGoogleAuth}
                                    disabled={googleLoader || loader}
                                    className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-black text-gray-800 transition hover:border-orange-200 hover:bg-orange-50/50 disabled:opacity-70"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {googleLoader ? (
                                        <ImSpinner2 className="size-5 animate-spin text-[#ff4d2d]" />
                                    ) : (
                                        <FcGoogle className="size-5" />
                                    )}
                                    Sign up with Google
                                </motion.button>

                                <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                                    <span className="h-px flex-1 bg-gray-200" />
                                    or email verification
                                    <span className="h-px flex-1 bg-gray-200" />
                                </div>

                                <label className="text-sm font-bold text-gray-700">
                                    Email address
                                    <div className="relative mt-2">
                                        <LuMail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            className="field pl-11"
                                            placeholder="you@example.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            autoComplete="email"
                                        />
                                    </div>
                                </label>

                                {error && (
                                    <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                        {error}
                                    </p>
                                )}

                                <motion.button
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black"
                                    type="submit"
                                    disabled={loader}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loader && <ImSpinner2 className="size-5 animate-spin" />}
                                    Send Verification OTP
                                </motion.button>
                            </motion.form>
                        )}

                        {/* ── Step 2: OTP Verification ── */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleVerifyOTP}
                            >
                                <h2 className="text-3xl font-black text-gray-950">
                                    Verify email
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the 4-digit code sent to <span className="font-bold text-gray-800">{email}</span>
                                </p>

                                <div className="mt-7 flex justify-center gap-3 sm:gap-4" onPaste={handleOtpPaste}>
                                    {otp.map((digit, index) => (
                                        <motion.input
                                            key={index}
                                            ref={otpRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className={`otp-input ${digit ? "filled" : ""}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                                        {error}
                                    </p>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={loader || otp.join("").length < 4}
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loader && <ImSpinner2 className="size-5 animate-spin" />}
                                    Verify OTP
                                </motion.button>

                                <div className="mt-5 flex items-center justify-center gap-4 text-sm">
                                    {resendTimer > 0 ? (
                                        <span className="font-semibold text-gray-400">
                                            Resend in <span className="font-black text-[var(--brand)]">{resendTimer}s</span>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            className="font-black text-[var(--brand)] hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                    <span className="text-gray-300">•</span>
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setError(""); setOtp(["", "", "", ""]); }}
                                        className="font-bold text-gray-500 hover:text-gray-900"
                                    >
                                        Change email
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* ── Step 3: Complete Name & Password Details ── */}
                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSignup}
                            >
                                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                                    <LuCheck size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-950">
                                    Details
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter your details to finalize setting up your account.
                                </p>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <label className="text-sm font-bold text-gray-700 sm:col-span-2">
                                        Full name
                                        <div className="relative mt-2">
                                            <LuUser className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                className="field pl-11"
                                                placeholder="Your name"
                                                onChange={(e) => setFullName(e.target.value)}
                                                value={fullName}
                                                autoComplete="name"
                                            />
                                        </div>
                                    </label>

                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">
                                            Verified email
                                        </label>
                                        <div className="mt-2 rounded-2xl bg-green-50/50 border border-green-100 px-4 py-3 text-sm font-bold text-green-700">
                                            {email} (Verified)
                                        </div>
                                    </div>

                                    <label className="text-sm font-bold text-gray-700 sm:col-span-2">
                                        Mobile number
                                        <div className="relative mt-2">
                                            <LuPhone className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                className="field pl-11"
                                                placeholder="10 digit number"
                                                onChange={(e) => setMobile(e.target.value)}
                                                value={mobile}
                                                autoComplete="tel"
                                            />
                                        </div>
                                    </label>

                                    <label className="text-sm font-bold text-gray-700 sm:col-span-2">
                                        Password
                                        <div className="relative mt-2">
                                            <LuLock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="field pl-11 pr-11"
                                                placeholder="At least 6 characters"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-orange-50 hover:text-[#ff4d2d]"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? <LuEyeOff /> : <LuEye />}
                                            </button>
                                        </div>
                                    </label>
                                </div>

                                {error && (
                                    <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                        {error}
                                    </p>
                                )}

                                <motion.button
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black"
                                    type="submit"
                                    disabled={loader}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loader && <ImSpinner2 className="size-5 animate-spin" />}
                                    Create account
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="font-black text-[#ff4d2d] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SignUp;
