import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
    // console.log("REQ USER:", req.user);
    // console.log("REQ BODY:", req.body);

    try {
        const {
            cartItems,
            paymentMethod,
            delivaryAddress,
            totalAmount,
            delivaryFee,
        } = req.body;
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        if (
            !delivaryAddress?.text ||
            delivaryAddress.lattitude == null ||
            delivaryAddress.longitude == null
        ) {
            return res
                .status(400)
                .json({ message: "Send Valid Delivary  Address" });
        }

        const groupItemsByShop = {};

        cartItems.forEach((item) => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];
            }
            groupItemsByShop[shopId].push(item);
        });

        const shopOrders = await Promise.all(
            Object.keys(groupItemsByShop).map(async (shopId) => {
                const shop = await Shop.findById(shopId).populate("owner");
                if (!shop)
                    return res.status(400).json({ message: "Shop not found" });
                const items = groupItemsByShop[shopId];
                const subTotal = items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                );
                return {
                    shop: shop._id,
                    owner: shop.owner?._id,
                    subTotal: subTotal,
                    shopOrderItems: items.map((item) => ({
                        item: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                };
            }),
        );

        const payableAmount = totalAmount + delivaryFee;

        const newOrder = await Order.create({
            user: req.user?.userId,
            paymentMethod: paymentMethod,
            delivaryAddress: delivaryAddress,
            totalAmount: totalAmount,
            shopOrders: shopOrders,
            delivaryFee: delivaryFee,
            payableAmount: payableAmount,

        });
        return res
            .status(201)
            .json({ data: newOrder, message: "Order Placed Successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: placeOrder", error });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        const role = user?.role;

        let ordersQuery;
        let populateFields;

        if (role === "user") {
            ordersQuery = { user: userId };
            populateFields =
                "shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item";
        } 
        else if (role === "owner") {
            ordersQuery = { "shopOrders.owner": userId };
            populateFields =
                "user shopOrders.shop shopOrders.shopOrderItems.item";
        } 
        else {
            return res.status(403).json({ message: "Invalid role" });
        }

        const orders = await Order.find(ordersQuery)
            .sort({ createdAt: -1 })
            .populate(populateFields);

        res.status(200).json({
            data: orders,
            message: "Orders Fetched Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: getOrdersByRole",
            error,
        });
    }
};
