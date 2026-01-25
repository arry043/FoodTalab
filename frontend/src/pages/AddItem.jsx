import { IoIosArrowRoundBack } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

function AddItem() {
    const primaryColor = "#f25a13";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { myShopData } = useSelector((state) => state.owner);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [foodType, setFoodType] = useState("Veg");
    const [category, setCategory] = useState("");
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        "Snacks",
        "Main Course",
        "Desserts",
        "Drinks",
        "Pizza",
        "Burger",
        "Sandwich",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others",
    ];

    const handleImage = async (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("foodType", foodType);
            formData.append("category", category);
            if (backendImage instanceof File) {
                formData.append("image", backendImage);
            }

            const result = await axios.post(
                `${serverUrl}/api/item/add-item`,
                formData,
                { withCredentials: true },
            );
            console.log("Add items data by shop: ", result);
            dispatch(setMyShopData(result?.data?.data));
            setLoading(false);
            toast.success("Item added successfully");
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.log("Error: adding shop: ", error);
            toast.error("Failed to add item");
        }
    };

    return (
        <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative Ito-white min-h-screen">
            <ToastContainer />
            <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px]">
                <Link to="/">
                    <IoIosArrowRoundBack
                        className="size-20"
                        style={{ color: primaryColor }}
                    />
                </Link>
            </div>
            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
                <div className="flex flex-col items-center mb-6">
                    <div>
                        {" "}
                        <GiForkKnifeSpoon className="text-[#ff4d2d] w-13  h-13 mb-5 sm:w-16 sm:h-16" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-700">
                        Add Food
                    </div>
                </div>

                <form method="POST" className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Food Name:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your Shop Name"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description:
                        </label>
                        <input
                            type="text"
                            placeholder="About this food"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image:
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={handleImage}
                        />
                        <center>
                            {(frontendImage || backendImage) && (
                                <div className="relative inline-block mt-4">
                                    {/* ❌ Close Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFrontendImage(null);
                                            setBackendImage(null);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = ""; // ✅ clears file name
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition z-10"
                                    >
                                        <IoClose
                                            size={20}
                                            className="text-[#ff4d2d]"
                                        />
                                    </button>

                                    {/* 🖼 Image */}
                                    <img
                                        src={frontendImage || backendImage}
                                        alt="preview"
                                        className="w-auto h-50 rounded-lg border object-cover"
                                    />
                                </div>
                            )}
                        </center>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹):
                        </label>
                        <input
                            type="number"
                            placeholder="Price of the food"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Type:
                            </label>
                            <select
                                className="border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2 bg-white"
                                value={foodType}
                                onChange={(e) => setFoodType(e.target.value)}
                            >
                                <option value="">Select food type</option>
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Category:
                            </label>
                            <select
                                className="border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2 bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select category</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full cursor-pointer bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-5 00 hover:shadow-lg transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader
                                color="#fff"
                                loading={loading}
                                size={20}
                            />
                        ) : (
                            "Add Item"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddItem;
