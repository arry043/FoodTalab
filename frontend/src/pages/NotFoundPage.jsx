import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#fff7f2] via-white to-[#ffe8de] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-[#ff4d2d]/20 blur-[140px] rounded-full"></div>
            <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-orange-300/20 blur-[140px] rounded-full"></div>

            {/* Animation */}
            <div className="w-full max-w-4xl mb-6 relative z-10">
                <DotLottieReact
                    src="https://lottie.host/e09cea0f-8c38-4200-9885-c05812644989/6mPoFH5VgZ.lottie"
                    loop
                    autoplay
                    className="w-full h-auto"
                />
            </div>

            {/* Text */}
            <h1 className="text-7xl font-extrabold bg-gradient-to-r from-[#ff4d2d] to-orange-500 bg-clip-text text-transparent relative z-10">
                404
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-3 relative z-10">
                Oops! Page Not Found
            </h2>

            <p className="text-gray-500 mt-4 max-w-md text-sm md:text-base leading-relaxed relative z-10">
                The page you are trying to access doesn’t exist or may
                have been moved. Let’s get you back to something delicious 🍕
            </p>

            {/* Button */}
            <Link
                to="/"
                className="mt-8 flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e64427] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] relative z-10"
            >
                <FaArrowLeft size={14} />
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;