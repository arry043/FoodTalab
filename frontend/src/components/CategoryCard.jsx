import React from "react";

const CategoryCard = ({ data, onClick }) => {
    return (
        <div className="flex flex-col items-center shrink-0 cursor-pointer group" onClick={onClick}>

            <div
                className="w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] md:w-[120px] md:h-[120px]
                rounded-full overflow-hidden bg-white shadow-md
                group-hover:shadow-xl transition"
            >
                <img
                    src={data.image}
                    alt={data.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                />
            </div>
            <p className="mt-2 text-sm sm:text-base font-medium text-gray-700 text-center">
                {data.category}
            </p>
        </div>
    );
};


export default CategoryCard;
