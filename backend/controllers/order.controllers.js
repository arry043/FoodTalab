import DelivaryAssignment from "../models/delivaryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendOtpDelivery } from "../utils/mail.js";

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
                )
                .populate("shopOrders.assignedDeliveryBoy");

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
        if (status === "outForDelivery" && !shopOrder.assignment) {
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
            .populate({
                path: "order",
                populate: { path: "user", select: "fullName mobile" },
            })
            .populate("shop")
            .populate("shopOrder");

        // console.log("assignments: ", assignments);

        const formattedAssignments = assignments.map((a) => {
            const shopOrder = a.order.shopOrders.find(
                (so) => so._id.toString() === a.shopOrder.toString(),
            );

            return {
                assignmentId: a._id,
                orderId: a.order._id,

                customer: {
                    name: a.order.user?.fullName || "Customer Name",
                    phone: a.order.user?.mobile || "Customer Phone",
                },

                shopName: a.shop?.name || "Shop Name",
                shopAddress: a.shop?.address || "Shop Address",
                shopContact: a.shop?.contact || "Shop Phone",

                deliveryAddress: a.order?.delivaryAddress,

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

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await DelivaryAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        if (assignment.status !== "BROADCASTED") {
            return res
                .status(400)
                .json({ message: "Assignment already accepte or expired" });
        }
        const alreadyAssigned = await DelivaryAssignment.findOne({
            assignTo: req.user.userId,
            status: {
                $nin: ["BROADCASTED", "EXPIRED"],
            },
        });
        if (alreadyAssigned) {
            return res
                .status(400)
                .json({ message: "You already have an assignment of order" });
        }
        assignment.assignTo = req.user.userId;
        assignment.status = "ASSIGNED";
        assignment.acceptedAt = new Date();
        await assignment.save();

        const order = await Order.findById(assignment.order);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrders.find(
            (so) => so._id.toString() === assignment.shopOrder.toString(),
        );
        shopOrder.assignedDeliveryBoy = req.user.userId;
        await order.save();
        await order.populate("shopOrders.assignedDeliveryBoy");
        return res
            .status(200)
            .json({ message: "Assignment / Order accepted successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: acceptOrder", error });
    }
};

export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DelivaryAssignment.findOne({
            assignTo: req.user.userId,
            status: "ASSIGNED",
        })
            .populate("shop")
            .populate("assignTo")
            .populate({
                path: "order",
                populate: {
                    path: "user",
                    select: "fullName email mobile location",
                },
            });

        if (!assignment) {
            return res.status(404).json({ message: "No current assignment" });
        }

        if (!assignment.order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // ✅ sirf assigned shopOrder nikaalo
        const order = assignment.order;

        const shopOrder = order.shopOrders.find(
            (so) => so._id.toString() === assignment.shopOrder.toString(),
        );

        if (!shopOrder) {
            return res.status(404).json({ message: "Shop order not found" });
        }

        return res.status(200).json({
            message: "Current delivery order",
            data: {
                _id: assignment.order._id,
                assignmentId: assignment._id,
                status: assignment.status,
                acceptedAt: assignment.acceptedAt,

                shop: assignment.shop,
                deliveryBoy: assignment.assignTo,

                customer: order.user,
                deliveryAddress: order.delivaryAddress,
                paymentMethod: order.paymentMethod,

                shopOrder, // ✅ only this shop's items
                totalAmount: shopOrder.subTotal,
                deliveryFee: order.delivaryFee,
                payableAmount: order.payableAmount,
            },
        });
    } catch (error) {
        console.log("getCurrentOrder error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId)
            .populate("shopOrders.shop shopOrders.assignedDeliveryBoy")
            .populate({
                path: "shopOrders.shop",
                model: "Shop",
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User",
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item",
            })
            .lean();

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ data: order, message: "Order found" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getOrderById", error });
    }
};

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const order = await Order.findById(orderId).populate("user");
        const shopOrder = order.shopOrders.find(
            (so) => so._id.toString() === shopOrderId.toString(),
        );
        if (!order || !shopOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log("-->",order);
        console.log("---->",shopOrder);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("otp-> ",otp);
        shopOrder.deliveryOtp = otp;
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
        await order.save();
        await sendOtpDelivery(order.user, otp);
        return res.status(200).json({
            message: `OTP sent successfully to ${order?.user?.fullName}`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Server Error: sendDeliveryOtp", error });
    }
};

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body;
        const order = await Order.findById(orderId).populate("user");
        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!order || !shopOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (shopOrder.deliveryOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (shopOrder.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        if (shopOrder.status === "delivered") {
            return res.status(400).json({ message: "Order already delivered" });
        }

        shopOrder.status = "delivered";
        shopOrder.deliveredAt = new Date();
        await order.save();
        await DelivaryAssignment.deleteOne({
            order: order._id,
            shopOrder: shopOrder._id,
            assignTo: shopOrder.assignedDeliveryBoy,
        });
        return res
            .status(200)
            .json({ message: "Order delivered successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: verifyDeliveryOtp", error });
    }
};
