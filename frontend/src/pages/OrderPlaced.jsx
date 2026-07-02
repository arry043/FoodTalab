import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LuCheck, LuPackage, LuPartyPopper } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/userSlice";

const CONFETTI_COLORS = ["#ff4d2d", "#ff7a36", "#ffb347", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

const ConfettiPiece = ({ index }) => {
    const style = useMemo(() => ({
        left: `${Math.random() * 100}%`,
        background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        animationDelay: `${Math.random() * 0.8}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
        width: `${6 + Math.random() * 8}px`,
        height: `${6 + Math.random() * 8}px`,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
    }), [index]);

    return <div className="confetti-piece" style={style} />;
};

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

function OrderPlaced() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Clear cart after order
    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <motion.div
            {...pageVariants}
            className="app-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
        >
            {/* Confetti */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                    <ConfettiPiece key={i} index={i} />
                ))}
            </div>

            {/* Background glow */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-orange-200/30 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-200/30 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="panel relative z-10 max-w-md w-full rounded-[2rem] p-8 sm:p-10"
            >
                {/* Animated Checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 250, damping: 15 }}
                    className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-green-50"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 12 }}
                    >
                        <svg
                            viewBox="0 0 52 52"
                            className="size-12 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <motion.path
                                d="M14 27 L22 35 L38 17"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-2xl font-black text-gray-950 sm:text-3xl"
                >
                    <LuPartyPopper className="text-[var(--brand)]" />
                    Order placed!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-3 text-sm leading-6 text-gray-500"
                >
                    Your delicious food is being prepared.
                    Sit back and relax — we'll deliver it soon!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-4"
                >
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Estimated delivery
                    </p>
                    <p className="mt-1 text-xl font-black text-[var(--brand)]">
                        30 – 40 mins
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 flex flex-col gap-3"
                >
                    <motion.button
                        onClick={() => navigate("/my-orders")}
                        className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                        whileTap={{ scale: 0.97 }}
                    >
                        <LuPackage size={16} />
                        Track order
                    </motion.button>

                    <motion.button
                        onClick={() => navigate("/")}
                        className="btn-ghost flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                        whileTap={{ scale: 0.97 }}
                    >
                        Order more food
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default OrderPlaced;
