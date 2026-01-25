import axios from "axios";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice";
import { serverUrl } from "../App";

function OwnerItemCard({ key, data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteItem = async (e) => {
        e.preventDefault();
        const isConfirm = window.confirm(
            "Are you sure you want to delete this item?",
        );
        if (!isConfirm) return; // ❌ cancel pe yahin ruk jao
        console.log("deleting....");
        try {
            const result = await axios.delete(
                `${serverUrl}/api/item/delete-item/${data._id}`,
                { withCredentials: true },
            );
            console.log("While Deleting: ", result);
            dispatch(setMyShopData(result?.data?.data));
        } catch (error) {
            console.log("Delete item error:", error);
        }
    };

    return (
        <div
            key={key}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-100 flex flex-col sm:flex-row"
        >
            {/* IMAGE */}
            <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {data.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {data.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                            {data.foodType}
                        </span>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                            {data.category}
                        </span>
                    </div>
                </div>

                {/* PRICE + ACTIONS */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-[#ff4d2d]">
                        ₹{data.price}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/edit-item/${data._id}`)}
                            className="flex items-center cursor-pointer gap-1 text-sm p-2 rounded-full bg-[#ff4d2d]/15 text-[#ff4d2d] hover:bg-[#ff4d2d]/25 transition"
                        >
                            <FaPen />
                        </button>

                        <button
                            onClick={handleDeleteItem}
                            className="flex items-center cursor-pointer gap-1 text-sm p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                            <MdDelete />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerItemCard;
