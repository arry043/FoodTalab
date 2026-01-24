import { IoIosArrowRoundBack } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function EditItem() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { myShopData } = useSelector((state) => state.owner);

    const [name, setName] = useState(item?.name || "");
    const [price, setPrice] = useState(item?.price || 0);
    const [description, setDescription] = useState(item?.description || "");
    const [foodType, setFoodType] = useState(item?.foodType || "Veg");
    const [category, setCategory] = useState(item?.category || "");
    const [frontendImage, setFrontendImage] = useState(item?.image || null);
    const [backendImage, setBackendImage] = useState(null);

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

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("foodType", foodType);
            formData.append("category", category);
            if (backendImage) formData.append("image", backendImage);

            const result = await axios.put(
                `${serverUrl}/api/item/edit-item/${item._id}`,
                formData,
                { withCredentials: true },
            );

            dispatch(setMyShopData(result.data.data));
            navigate("/");
        } catch (error) {
            console.log("Edit item error:", error);
        }
    };

    useEffect(() => {
        const handleGetItemById = async () => {};
    }, []);

    return (
        <div className="flex justify-center items-center p-6 bg-orange-50 min-h-screen">
            <div className="absolute top-5 left-5">
                <Link to="/">
                    <IoIosArrowRoundBack className="size-16 text-[#f25a13]" />
                </Link>
            </div>

            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border">
                <div className="flex flex-col items-center mb-6">
                    <GiForkKnifeSpoon className="text-[#ff4d2d] w-16 h-16 mb-3" />
                    <h2 className="text-2xl font-bold text-gray-700">
                        Edit Food Item
                    </h2>
                </div>

                <form className="space-y-5">
                    <input
                        className="input"
                        placeholder="Food name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="number"
                        className="input"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="input"
                        onChange={handleImage}
                    />

                    {frontendImage && (
                        <div className="relative w-fit mx-auto">
                            <img
                                src={frontendImage}
                                className="h-40 rounded-lg border"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setFrontendImage(null);
                                    setBackendImage(null);
                                    fileInputRef.current.value = "";
                                }}
                                className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow"
                            >
                                <IoClose className="text-[#ff4d2d]" />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            className="input"
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                        >
                            <option>Veg</option>
                            <option>Non-Veg</option>
                        </select>

                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[#ff4d2d] text-white py-3 rounded-lg font-semibold hover:bg-[#e64528]"
                    >
                        Update Item
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditItem;
