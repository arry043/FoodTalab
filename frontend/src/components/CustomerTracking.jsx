import scooter from "../assets/delivery_scooter.png";
import home from "../assets/customer_house.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
} from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
});

const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
});

function CustomerTracking({ data }) {
    const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
    const deliveryBoyLon = data?.deliveryBoyLocation?.lng;
    const customerLat = data?.customerLocation?.lat;
    const customerLon = data?.customerLocation?.lng;

    const path = [
        [deliveryBoyLat, deliveryBoyLon],
        [customerLat, customerLon],
    ];

    const center = [deliveryBoyLat, deliveryBoyLon];

    return (
        <div className="w-full h-[400px] mt-5 rounded-xl overflow-hidden shadow-md">
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[deliveryBoyLat, deliveryBoyLon]}
                    icon={deliveryBoyIcon}
                >
                    <Popup>Delivery Boy</Popup>
                </Marker>
                <Marker
                    position={[customerLat, customerLon]}
                    icon={customerIcon}
                >
                    <Popup>Delivery Boy</Popup>
                </Marker>

                <Polyline pathOptions={{ color: "blue" }} positions={path} />
            </MapContainer>
        </div>
    );
}

export default CustomerTracking;
