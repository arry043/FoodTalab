import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LuArrowLeft, LuCheck, LuLock, LuMail } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { serverUrl } from "../config/api";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const stepLabels = ["Enter email", "Verify OTP", "New password"];

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shakeError, setShakeError] = useState(false);

    // Resend timer
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    const triggerShake = () => {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 500);
    };

    // ──────────── Step 1: Send OTP ────────────
    const handleSendOTP = async (e) => {
        e?.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email.");
            triggerShake();
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
            toast.success("OTP sent to your email");
            setStep(2);
            setResendTimer(60);
            setTimeout(() => otpRefs[0].current?.focus(), 200);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to send OTP";
            setError(message);
            toast.error(message);
            triggerShake();
        } finally {
            setLoading(false);
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
            setError("Please enter the complete 4-digit OTP.");
            triggerShake();
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post(`${serverUrl}/api/auth/varify-otp`, {
                email,
                otp: Number(otpString),
            });
            toast.success("OTP verified");
            setStep(3);
        } catch (err) {
            const message = err.response?.data?.message || "Invalid OTP";
            setError(message);
            toast.error(message);
            triggerShake();
            setOtp(["", "", "", ""]);
            otpRefs[0].current?.focus();
        } finally {
            setLoading(false);
        }
    };

    // ──────────── Step 3: Reset Password ────────────
    const handleResetPassword = async (e) => {
        e?.preventDefault();
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            triggerShake();
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            triggerShake();
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post(`${serverUrl}/api/auth/reset-password`, {
                email,
                newPassword,
            });
            toast.success("Password reset successfully");
            setTimeout(() => navigate("/signin"), 1500);
        } catch (err) {
            const message = err.response?.data?.message || "Could not reset password";
            setError(message);
            toast.error(message);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        {stepLabels.map((label, i) => (
                            <span
                                key={label}
                                className={`text-[10px] font-bold uppercase tracking-widest ${
                                    step >= i + 1 ? "text-[var(--brand)]" : "text-gray-400"
                                }`}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-bar-fill"
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>
                </div>

                <motion.div
                    className={`panel rounded-[2rem] p-6 sm:p-8 ${shakeError ? "animate-shake" : ""}`}
                    layout
                >
                    <Link
                        to="/"
                        className="mb-6 inline-block text-2xl font-black text-[var(--brand)]"
                    >
                        FoodTalab
                    </Link>

                    <AnimatePresence mode="wait">
                        {/* ─── Step 1: Email ─── */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSendOTP}
                            >
                                <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">
                                    Forgot password?
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the email linked to your account.
                                    We'll send a 4-digit OTP.
                                </p>

                                <label className="mt-6 block text-sm font-bold text-gray-700">
                                    Email
                                    <div className="relative mt-2">
                                        <LuMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            className="field pl-10"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </div>
                                </label>

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
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {loading && <ImSpinner2 className="size-4 animate-spin" />}
                                    Send OTP
                                </motion.button>

                                <Link
                                    to="/signin"
                                    className="mt-5 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[var(--brand)]"
                                >
                                    <LuArrowLeft size={14} />
                                    Back to Sign in
                                </Link>
                            </motion.form>
                        )}

                        {/* ─── Step 2: OTP ─── */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleVerifyOTP}
                            >
                                <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">
                                    Verify OTP
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the 4-digit code sent to{" "}
                                    <span className="font-bold text-gray-800">{email}</span>
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
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-600"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={loading || otp.join("").length < 4}
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {loading && <ImSpinner2 className="size-4 animate-spin" />}
                                    Verify
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
                                        onClick={() => { setStep(1); setError(""); setOtp(["","","",""]); }}
                                        className="font-bold text-gray-500 hover:text-gray-900"
                                    >
                                        Change email
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* ─── Step 3: New Password ─── */}
                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleResetPassword}
                            >
                                <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                                    <LuCheck size={28} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">
                                    Set new password
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Choose a new password for your account.
                                </p>

                                <label className="mt-6 block text-sm font-bold text-gray-700">
                                    New password
                                    <div className="relative mt-2">
                                        <LuLock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            className="field pl-10"
                                            placeholder="At least 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </label>

                                <label className="mt-4 block text-sm font-bold text-gray-700">
                                    Confirm password
                                    <div className="relative mt-2">
                                        <LuLock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            className="field pl-10"
                                            placeholder="Re-enter your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </label>

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
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {loading && <ImSpinner2 className="size-4 animate-spin" />}
                                    Reset password
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default ForgotPassword;
