import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

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

        const newOrder = await Order.create({
            user: req.user?.userId,
            paymentMethod: paymentMethod,
            delivaryAddress: delivaryAddress,
            totalAmount: totalAmount,
            shopOrders: shopOrders,
            delivaryFee: delivaryFee,
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

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user?.userId })
            .sort({ createdAt: -1 })
            .populate(
                "shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
            );
        res.status(200).json({ data: orders, message: "User Orders Fetched" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getUserOrders", error });
    }
};

export const getOwnerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ "shopOrders.owner": req.user?.userId })
            .sort({ createdAt: -1 })
            .populate(
                "user shopOrders.shop shopOrders.shopOrderItems.item",
            );
        res.status(200).json({ data: orders, message: "Owner Orders Fetched" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getOwnerOrders", error });
    }
};