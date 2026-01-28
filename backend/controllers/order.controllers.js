import DelivaryAssignment from "../models/delivaryAssignment.model.js";
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
        await newOrder.populate(
            "user shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
        );
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

        let orders;

        if (role === "user") {
            orders = await Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .populate(
                    "shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
                );
        } else if (role === "owner") {
            // ✅ get owner's shop
            const ownerShop = await Shop.findOne({ owner: userId });
            if (!ownerShop) {
                return res
                    .status(404)
                    .json({ message: "Shop not found for this owner" });
            }

            const allOrders = await Order.find({
                "shopOrders.shop": ownerShop._id,
            })
                .sort({ createdAt: -1 })
                .populate(
                    "user shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
                );

            // ✅ FILTER shopOrders by SHOP ID (not owner)
            orders = allOrders.map((order) => {
                const filteredShopOrders = order.shopOrders.filter(
                    (so) =>
                        so.shop?._id?.toString() === ownerShop._id.toString(),
                );

                return {
                    ...order.toObject(),
                    shopOrders: filteredShopOrders,
                };
            });
        }
        
        res.status(200).json({
            data: orders,
            message: "Orders Fetched Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: getMyOrders",
            error,
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const shopOrder = order.shopOrders.find(
            (so) => so.shop?.toString() === shopId,
        );

        if (!shopOrder)
            return res.status(404).json({ message: "Shop order not found" });

        // ✅ update status
        shopOrder.status = status;

        let deliveryBoysPayload = [];

        // ✅ assign delivery boys when needed
        if (status === "outForDelivery" || !shopOrder.assignment) {
            const { lattitude, longitude } = order.delivaryAddress;

            const deliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(lattitude)],
                        },
                        $maxDistance: 10000,
                    },
                },
            });

            const nearByIds = deliveryBoys.map((db) => db._id);

            const busyIds = await DelivaryAssignment.find({
                assignTo: { $in: nearByIds },
                status: { $nin: ["BROADCASTED", "EXPIRED"] },
            }).distinct("assignTo");

            const busySet = new Set(busyIds.map((id) => id.toString()));

            const availableDeliveryBoys = deliveryBoys.filter(
                (db) => !busySet.has(db._id.toString()),
            );

            const candidates = availableDeliveryBoys.map((b) => b._id);

            if (candidates.length === 0) {
                await order.save();

                const populatedOrder = await Order.findById(orderId).populate(
                    "user shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
                );

                const updatedShopOrder = populatedOrder.shopOrders.find(
                    (so) => so.shop?._id?.toString() === shopId,
                );

                return res.status(200).json({
                    shopOrder: updatedShopOrder,
                    assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
                    availableDeliveryBoys: [],
                    asignment: updatedShopOrder?.assignment?._id,
                    data: populatedOrder,
                    message:
                        "Order status updated but no delivery boy is available",
                });
            }

            const deliveryAssignment = await DelivaryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrder: shopOrder._id,
                broadcastedTo: candidates,
                status: "BROADCASTED",
            });

            shopOrder.assignment = deliveryAssignment._id;

            deliveryBoysPayload = availableDeliveryBoys.map((db) => ({
                id: db._id,
                fullName: db.fullName,
                email: db.email,
                longitude: db.location?.coordinates?.[0],
                lattitude: db.location?.coordinates?.[1],
                mobile: db.mobile,
            }));
        }

        await order.save();

        // ✅ fully populated order
        const populatedOrder = await Order.findById(orderId).populate(
            "user shopOrders.owner shopOrders.shop shopOrders.shopOrderItems.item",
        );

        const updatedShopOrder = populatedOrder.shopOrders.find(
            (so) => so.shop?._id?.toString() === shopId,
        );

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableDeliveryBoys: deliveryBoysPayload,
            asignment: updatedShopOrder?.assignment?._id,
            data: populatedOrder,
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error("UPDATE STATUS ERROR 👉", error);
        return res.status(500).json({
            message: "Server Error: updateOrderStatus",
            error: error.message,
        });
    }
};

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.user?.userId;

        const assignments = await DelivaryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "BROADCASTED",
        })
            .populate("order")
            .populate("shop")
            .populate("shopOrder");

        const formattedAssignments = assignments.map((a) => {
            const shopOrder = a.order.shopOrders.find(
                (so) => so._id.toString() === a.shopOrder.toString()
            );

            return {
                assignmentId: a._id,
                orderId: a.order._id,
                shopName: a.shop.name,
                deliveryAddress: a.order.delivaryAddress,
                items: shopOrder?.shopOrderItems || [],
                subTotal: shopOrder?.subTotal || 0,
            };
        });

        return res.status(200).json({
            data: formattedAssignments,
            message: "Assignment fetched successfully",
        });
    } catch (error) {
        console.error("GET ASSIGNMENT ERROR 👉", error);
        return res.status(500).json({
            message: "Server Error: getAssignment",
            error: error.message,
        });
    }
};
