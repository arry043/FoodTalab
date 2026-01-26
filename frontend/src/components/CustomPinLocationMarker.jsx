import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MdLocationPin } from "react-icons/md";

export const CustomPinLocationMarker = new L.DivIcon({
    html: renderToStaticMarkup(
        <div className="flex items-center justify-center">
            <MdLocationPin size={35} className="text-blue-500" />
        </div>
    ),
    className: "", // important: default leaflet styles hata deta hai
    iconSize: [40, 40],
    iconAnchor: [20, 40], // bottom center point
});
