import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff, LuLock, LuMail } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../config/api";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const [googleLoader, setGoogleLoader] = useState(false);
    const [shakeError, setShakeError] = useState(false);
    const dispatch = useDispatch();

    const triggerShake = () => {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter email and password.");
            triggerShake();
            return;
        }

        setLoader(true);
        setError("");
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signin`,
                { email, password },
                { withCredentials: true },
            );
            dispatch(setUserData(result?.data));
            toast.success("Signed in successfully");
        } catch (error) {
            const message = error.response?.data?.message || "Sign in failed";
            setError(message);
            toast.error(message);
            triggerShake();
        } finally {
            setLoader(false);
        }
    };

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
                    role: "user",
                },
                { withCredentials: true },
            );
            dispatch(setUserData(data));
            toast.success("Signed in with Google");
        } catch (error) {
            const message =
                error.response?.data?.message || "Google sign in failed";
            setError(message);
            toast.error(message);
        } finally {
            setGoogleLoader(false);
        }
    };

    return (
        <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] panel md:grid-cols-[0.9fr_1.1fr]">
                {/* Left panel */}
                <div className="hidden bg-gradient-to-br from-[#19120f] to-[#2d1a11] p-10 text-white md:flex md:flex-col md:justify-between">
                    <Link to="/" className="text-3xl font-black text-[var(--brand-light)]">
                        FoodTalab
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-xs font-black uppercase tracking-widest text-orange-300/80">
                            Welcome back
                        </p>
                        <h1 className="mt-3 text-4xl font-black leading-tight">
                            Your next meal is only a few taps away.
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/60">
                            Sign in to reorder favorites, track deliveries, and
                            manage your cart across devices.
                        </p>
                    </motion.div>
                    <p className="text-[10px] text-white/30">
                        Secure cookie login with Google sign in support.
                    </p>
                </div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSignin}
                    className={`p-6 sm:p-8 md:p-10 ${shakeError ? "animate-shake" : ""}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        to="/"
                        className="mb-8 inline-block text-3xl font-black text-[var(--brand)] md:hidden"
                    >
                        FoodTalab
                    </Link>
                    <h2 className="text-3xl font-black text-gray-950">
                        Sign in
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Continue with email or Google.
                    </p>

                    <motion.button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={googleLoader || loader}
                        className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm font-black text-gray-800 transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md disabled:opacity-70"
                        whileTap={{ scale: 0.98 }}
                    >
                        {googleLoader ? (
                            <ImSpinner2 className="size-5 animate-spin text-[var(--brand)]" />
                        ) : (
                            <FcGoogle className="size-5" />
                        )}
                        Sign in with Google
                    </motion.button>

                    <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="h-px flex-1 bg-gray-200" />
                        or email
                        <span className="h-px flex-1 bg-gray-200" />
                    </div>

                    <label className="text-sm font-bold text-gray-700">
                        Email
                        <div className="relative mt-2">
                            <LuMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                className="field pl-10"
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target?.value)}
                                value={email}
                                autoComplete="email"
                            />
                        </div>
                    </label>

                    <label className="mt-4 block text-sm font-bold text-gray-700">
                        Password
                        <div className="relative mt-2">
                            <LuLock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="field pl-10 pr-10"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-orange-50 hover:text-[var(--brand)]"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                            </button>
                        </div>
                    </label>

                    <div className="mt-3 flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs font-bold text-[var(--brand)] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black"
                        type="submit"
                        disabled={loader || googleLoader}
                        whileTap={{ scale: 0.97 }}
                    >
                        {loader && <ImSpinner2 className="size-4 animate-spin" />}
                        Sign in
                    </motion.button>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        New here?{" "}
                        <Link
                            to="/signup"
                            className="font-black text-[var(--brand)] hover:underline"
                        >
                            Create an account
                        </Link>
                    </p>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default SignIn;
