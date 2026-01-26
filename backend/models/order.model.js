import mongoose from "mongoose";

const shopOrderItemsSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }, 
});

const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subTotal:{
        type: Number,
        required: true
    },
    shopOrderItems: [shopOrderItemsSchema],
},{timestamps:true});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true,
    },
    delivaryAddress: {
        text: String,
        required: true,
        lattitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    totalAmount: {
        type:Number,
        required: true
    },
    delivaryFee: {
        type: Number,
        required: true,
    },
    shopOrders: [shopOrderSchema]
},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);
export default Order;

