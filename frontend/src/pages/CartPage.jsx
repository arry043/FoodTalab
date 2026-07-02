import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuMinus, LuPlus, LuShoppingBag, LuTrash2, LuArrowRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import {
    addToCart,
    removeFromCart,
    removeItemCompletelyFromCart,
} from "../redux/userSlice";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, totalAmount, delivaryFee } = useSelector(
        (state) => state.user,
    );

    const toPay = totalAmount + delivaryFee;
    const freeDeliveryGap = Math.max(0, 501 - totalAmount);
    const freeDeliveryProgress = Math.min(100, (totalAmount / 501) * 100);

    return (
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-24">
            <Navbar />

            <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 pt-24 md:grid-cols-[1fr_340px] md:px-5 md:pt-28 lg:grid-cols-[1fr_380px]">
                <section>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-1 text-sm font-black text-[var(--brand)] transition-all hover:gap-2"
                    >
                        <IoIosArrowRoundBack size={26} />
                        Back
                    </button>

                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-gray-950">
                            Your cart
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {cartItems.length > 0
                                ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} — review and checkout`
                                : "Your cart is empty"}
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="panel flex min-h-[400px] flex-col items-center justify-center rounded-3xl px-6 text-center"
                        >
                            <motion.div
                                className="mb-5 flex size-20 items-center justify-center rounded-full bg-orange-50 text-[var(--brand)]"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            >
                                <LuShoppingBag size={36} />
                            </motion.div>
                            <h2 className="text-2xl font-black text-gray-950">
                                Your cart is empty
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Add something tasty from nearby shops and it will
                                appear here.
                            </p>
                            <Link
                                to="/"
                                className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black"
                            >
                                Browse foods
                                <LuArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.article
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -80, transition: { duration: 0.25 } }}
                                        className="soft-card grid grid-cols-[72px_1fr] gap-3 rounded-2xl p-3 sm:grid-cols-[96px_1fr_auto] sm:gap-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-[72px] w-[72px] rounded-xl object-cover sm:h-24 sm:w-24 sm:rounded-2xl"
                                        />

                                        <div className="min-w-0">
                                            <h3 className="line-clamp-1 text-sm font-black text-gray-950 sm:text-base">
                                                {item.name}
                                            </h3>
                                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
                                                {item.foodType}
                                            </p>
                                            <p className="mt-2 text-base font-black text-[var(--brand)] sm:mt-3 sm:text-lg">
                                                ₹{item.price * item.quantity}
                                                <span className="ml-2 text-[10px] font-semibold text-gray-400 sm:text-xs">
                                                    (₹{item.price} × {item.quantity})
                                                </span>
                                            </p>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                                            <div className="flex h-9 items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-orange-50 px-1.5 text-[var(--brand)] sm:gap-3 sm:px-2 sm:h-10">
                                                <motion.button
                                                    type="button"
                                                    className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm sm:size-7"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart(item.id),
                                                        )
                                                    }
                                                    whileTap={{ scale: 0.85 }}
                                                >
                                                    <LuMinus size={13} />
                                                </motion.button>
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={item.quantity}
                                                        initial={{ y: -6, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 6, opacity: 0 }}
                                                        className="min-w-4 text-center text-sm font-black"
                                                    >
                                                        {item.quantity}
                                                    </motion.span>
                                                </AnimatePresence>
                                                <motion.button
                                                    type="button"
                                                    className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm sm:size-7"
                                                    onClick={() =>
                                                        dispatch(
                                                            addToCart({
                                                                id: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                                image: item.image,
                                                                shop: item.shop,
                                                                foodType:
                                                                    item.foodType,
                                                            }),
                                                        )
                                                    }
                                                    whileTap={{ scale: 0.85 }}
                                                >
                                                    <LuPlus size={13} />
                                                </motion.button>
                                            </div>

                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(
                                                        removeItemCompletelyFromCart(
                                                            item.id,
                                                        ),
                                                    )
                                                }
                                                className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:shadow-md sm:size-10"
                                                aria-label="Remove item"
                                                whileTap={{ scale: 0.85 }}
                                            >
                                                <LuTrash2 size={16} />
                                            </motion.button>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>

                {cartItems.length > 0 && (
                    <motion.aside
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="panel h-fit rounded-3xl p-5 md:sticky md:top-24"
                    >
                        <h2 className="text-xl font-black text-gray-950">
                            Bill summary
                        </h2>

                        {/* Free delivery progress */}
                        <div className="mt-4">
                            {freeDeliveryGap > 0 ? (
                                <div className="rounded-2xl bg-orange-50 p-4">
                                    <p className="text-xs font-bold text-orange-800">
                                        Add ₹{freeDeliveryGap} more for free delivery
                                    </p>
                                    <div className="progress-bar mt-2">
                                        <motion.div
                                            className="progress-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${freeDeliveryProgress}%` }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
                                    🎉 Free delivery unlocked!
                                </div>
                            )}
                        </div>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Item total</span>
                                <span className="font-semibold">₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery fee</span>
                                <span className="font-semibold">
                                    {delivaryFee === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        `₹${delivaryFee}`
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-orange-100 pt-4">
                                <div className="flex justify-between text-lg font-black text-gray-950">
                                    <span>To pay</span>
                                    <motion.span
                                        key={toPay}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        className="text-[var(--brand)]"
                                    >
                                        ₹{toPay}
                                    </motion.span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={() => navigate("/checkout")}
                            className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black"
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            Proceed to checkout
                            <LuArrowRight size={16} />
                        </motion.button>
                    </motion.aside>
                )}
            </main>
        </motion.div>
    );
}

export default CartPage;
