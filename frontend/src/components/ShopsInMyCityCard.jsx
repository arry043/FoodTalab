import React from "react";

function ShopsInMyCityCard({ name, image }) {
    return (
//         <div className="relative flex flex-col items-center shrink-0 cursor-pointer group">

//     {/* IMAGE CARD */}
//     <div
//         className="w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] md:w-[120px] md:h-[120px]
//         rounded-xl overflow-hidden bg-white shadow-md
//         group-hover:shadow-xl transition relative"
//     >
//         <img
//             src={image}
//             alt={name}
//             className="w-full h-full object-cover group-hover:scale-105 transition"
//         />

//         {/* NAME OVERLAY */}
//         <div className="
//             absolute bottom-0 left-0 w-full
//             bg-black/50 backdrop-blur-sm
//             text-white text-[11px] sm:text-xs font-medium
//             px-1 py-1 text-center
//             line-clamp-2
//         ">
//             {name}
//         </div>
//     </div>

//         </div>

        <div className="flex flex-col items-center shrink-0 cursor-pointer group">
            <div
                className="w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] md:w-[120px] md:h-[120px]
                rounded-xl overflow-hidden bg-white shadow-md
                group-hover:shadow-xl transition"
            >
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                />
            </div>

            <p className=" mt-2 text-sm sm:text-base font-medium text-gray-700 text-center w-[90px] leading-tight line-clamp-2">
                {name}
            </p>
        </div>
    );
}

export default ShopsInMyCityCard;
