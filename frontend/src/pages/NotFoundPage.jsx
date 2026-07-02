import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const NotFoundPage = () => {
    return (
        <motion.div
            {...pageVariants}
            className="app-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
            {/* Background Glows */}
            <div className="pointer-events-none absolute -top-36 -left-36 size-96 rounded-full bg-[var(--brand)]/10 blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-36 -right-36 size-96 rounded-full bg-orange-300/15 blur-[130px]" />

            {/* Animation */}
            <div className="relative z-10 w-full max-w-lg mb-6">
                <DotLottieReact
                    src="https://lottie.host/e09cea0f-8c38-4200-9885-c05812644989/6mPoFH5VgZ.lottie"
                    loop
                    autoplay
                    className="h-auto w-full"
                />
            </div>

            {/* Text */}
            <h1 className="relative z-10 text-6xl font-black tracking-tight text-[var(--brand)]">
                404
            </h1>

            <h2 className="relative z-10 mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
                Oops! Page not found
            </h2>

            <p className="relative z-10 mt-3 max-w-sm text-sm leading-6 text-gray-500">
                The page you are trying to access doesn’t exist or may
                have been moved. Let’s get you back to something delicious 🍕
            </p>

            {/* Button */}
<<<<<<< HEAD
            <Link
                to="/"
                className="mt-8 flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e64427] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] relative z-10"
            >
                <FaArrowLeft size={14} />
                Explore Us
            </Link>
        </div>
=======
            <motion.div className="relative z-10 mt-8" whileTap={{ scale: 0.96 }}>
                <Link
                    to="/"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-black"
                >
                    <FaArrowLeft size={12} />
                    Go Back Home
                </Link>
            </motion.div>
        </motion.div>
>>>>>>> d53c1ff (Improving UI/UX)
    );
};

export default NotFoundPage;
