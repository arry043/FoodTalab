import mongoose from "mongoose";

const delivaryAssignmentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        shopOrder: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        broadcastedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        assignTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        status: {
            type: String,
            enum: [
                "BROADCASTED",
                "ASSIGNED",
                "PICKEDUP",
                "COMPLETED",
                "EXPIRED",
            ],
            default: "BROADCASTED",
        },
        acceptedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

const DelivaryAssignment = mongoose.model("DelivaryAssignment", delivaryAssignmentSchema);
export default DelivaryAssignment;