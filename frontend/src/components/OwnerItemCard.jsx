import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function OwnerItemCard({key, data}) {
    const navigate = useNavigate();
    return (
        <div key={key} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-100 flex flex-col sm:flex-row">

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
                            onClick={() => navigate(`/delete-item/${data._id}`)}
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
