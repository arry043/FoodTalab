import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TbTrashXFilled } from "react-icons/tb";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { addToCart, removeFromCart, removeItemCompletelyFromCart } from "../redux/userSlice";

function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, totalAmount, delivaryFee } = useSelector((state) => state.user);

    return (
        <div className="min-h-screen bg-[#fff9f6]">
            <Navbar />

            <div className="flex justify-center px-4 pb-24">
                <div className="w-full md:mt-20 mt-12 max-w-3xl">
                    {/* 🔙 BACK */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center mt-5 gap-1 text-[#ff4d2d] mb-4"
                    >
                        <IoIosArrowRoundBack size={30} />
                        <span className="font-medium">Back</span>
                    </button>

                    {/* 🛒 TITLE */}
                    <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

                    {/* EMPTY CART */}
                    {cartItems.length === 0 ? (
                        <div className="bg-white p-10 rounded-xl flex flex-col items-center shadow text-center">
                            <MdOutlineAddShoppingCart
                                size={100}
                                className="mb-7 text-[#ff4d2d]"
                            />
                            <p className="text-gray-500 text-2xl">
                                Your cart is empty 😢
                            </p>
                            <Link
                                to={"/"}
                                className="h-full px-4 mt-5 py-2 text-md font-semibold rounded-full border border-[#ff4d2d] text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition"
                            >
                                Add Items
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* 🧾 CART ITEMS */}
                            <div className="bg-white rounded-xl shadow divide-y">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4"
                                    >
                                        {/* IMAGE */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />

                                        {/* INFO */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {item.foodType}
                                            </p>

                                            <p className="text-[#ff4d2d] text-xl font-bold mt-1 flex flex-row items-baseline gap-2">
                                                ₹{item.price * item.quantity}
                                                <span className="text-[11px] text-gray-500">
                                                    ({item.price} x {item.quantity})
                                                </span>
                                            </p>
                                        </div>

                                        {/* ✅ QTY CONTROL */}
                                        <div
                                            className="flex items-center gap-3 border border-[#ff4d2d]
            rounded-full px-3 py-1 text-[#ff4d2d] font-semibold"
                                        >
                                            <button
                                                className="text-lg"
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromCart(item.id),
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                className="text-lg"
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
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* 🗑 REMOVE COMPLETELY */}
                                        <button
                                            onClick={() => {
                                                for (
                                                    let i = 0;
                                                    i < item.quantity;
                                                    i++
                                                ) {
                                                    dispatch(
                                                        removeItemCompletelyFromCart(item.id),
                                                    );
                                                }
                                            }}
                                            className="p-2 rounded-full bg-red-50 hover:bg-red-100
            border border-red-200 hover:border-red-300 transition"
                                        >
                                            <TbTrashXFilled
                                                size={22}
                                                className="text-red-500"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* 💰 BILL SUMMARY */}
                            <div className="bg-white rounded-xl shadow mt-6 p-5 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Item Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>₹{delivaryFee}</span>
                                </div>

                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>To Pay</span>
                                    <span>₹{totalAmount + delivaryFee}</span>
                                </div>
                            </div>

                            {/* ✅ CHECKOUT */}
                            <button onClick={()=> navigate("/checkout")} className="w-full mt-6 bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold text-lg hover:bg-[#e64528] transition">
                                Proceed to Checkout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartPage;
