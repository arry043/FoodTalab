import { IoIosArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

function CheckOutPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount, delivaryFee, address, city } = useSelector(
        (state) => state.user,
    );

    const [paymentMethod, setPaymentMethod] = useState("COD");

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 pb-24">
            <div className="w-full md:mt-10 mt-5 max-w-3xl">
                {/* 🔙 BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-[#ff4d2d] mb-4"
                >
                    <IoIosArrowRoundBack size={30} />
                    <span className="font-medium">Back</span>
                </button>

                <h1 className="text-2xl font-bold mb-5">Checkout</h1>

                {/* 📍 DELIVERY ADDRESS */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-600">
                        {address || "Hostel / Home Address not set"}
                    </p>
                    <p className="text-sm text-gray-500">{city}</p>

                    <button
                        className="mt-2 text-sm text-[#ff4d2d] font-medium"
                        onClick={() => navigate("/profile")}
                    >
                        Change Address
                    </button>
                </div>

                {/* 📍 LOCATION PICKER */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MdLocationPin className="text-[#ff4d2d]" />
                        Pick Delivery Location
                    </h3>

                    <div className="flex items-center gap-2">
                        {/* INPUT */}
                        <div className="flex items-center flex-1 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400">
                            <FaSearch className="text-gray-400 text-sm mr-2" />
                            <input
                                placeholder="Search for area, street, landmark..."
                                className="w-full outline-none text-sm bg-transparent"
                            />
                        </div>

                        {/* CURRENT LOCATION BTN */}
                        <button
                            className="flex items-center justify-center gap-1 bg-blue-500 text-white
            px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                            <MdOutlineMyLocation size={18} />
                        </button>
                    </div>

                    {/* INFO TEXT */}
                    <p className="text-xs text-gray-500 mt-2">
                        Use current location or search manually
                    </p>
                </div>  

                {/* 🧾 ORDER SUMMARY */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-3">Order Summary</h3>

                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm mb-2"
                        >
                            <span className="line-clamp-1">
                                {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalAmount + delivaryFee}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                        Includes ₹{delivaryFee} delivery fee
                    </p>
                </div>

                {/* 💳 PAYMENT METHOD */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <h3 className="font-semibold mb-3">Payment Method</h3>

                    <div className="md:flex flex-row w-full gap-5 justify-center">
                        {/* COD */}
                        <label
                            className={`flex items-center gap-3 h-15 p-3 w-full rounded-lg border cursor-pointer mb-3 ${
                                paymentMethod === "COD"
                                    ? "border-[#ff4d2d] bg-orange-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                                className="accent-[#ff4d2d]"
                            />
                            <FaMoneyBillWave className="text-green-600" />
                            <span className="text-sm font-medium">
                                Cash on Delivery
                            </span>
                        </label>

                        {/* ONLINE */}
                        <label
                            className={`flex items-center gap-3 h-15 w-full p-3 rounded-lg border cursor-pointer ${
                                paymentMethod === "ONLINE"
                                    ? "border-[#ff4d2d] bg-orange-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="ONLINE"
                                checked={paymentMethod === "ONLINE"}
                                onChange={() => setPaymentMethod("ONLINE")}
                                className="accent-[#ff4d2d]"
                            />
                            <FaCreditCard className="text-blue-600" />
                            <span className="text-sm font-medium">
                                Online Payment
                            </span>
                        </label>
                    </div>
                </div>

                {/* ✅ PLACE ORDER */}
                <button
                    className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl
                    font-semibold text-lg hover:bg-[#e64528] transition"
                    onClick={() => alert(`Order placed with ${paymentMethod}`)}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

export default CheckOutPage;
