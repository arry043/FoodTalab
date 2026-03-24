import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../models/item.model.js";

export const addItem = async (req, res) => {
    try {
        const { name, description, price, foodType, category } = req.body;
        let image = null;
        if (req.file) {
            image = await uploadOnCloudinary(req.file?.path);
        }

        const shop = await Shop.findOne({ owner: req.user?.userId });
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        console.log("shop: ", shop);
        console.log("user: ", req.user);

        const newItem = await Item.create({
            name,
            description,
            price,
            foodType,
            category,
            image,
            shop: shop?._id,
        });

        shop.items.push(newItem?._id);
        await shop.save();
        await shop.populate("owner").populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });

        return res
            .status(200)
            .json({ data: shop, message: "Item added successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: addItem", error });
    }
};

export const editItem = async (req, res) => {
    try {
        const itemId = req.params?.itemId;
        const { name, description, price, foodType, category } = req.body;
        let image = null;
        if (req.file) {
            image = await uploadOnCloudinary(req.file?.path);
        }

        // console.log("Items: ",itemId)

        const updateData = {
            name,
            description,
            price,
            foodType,
            category,
        };

        if (image) updateData.image = image;

        const item = await Item.findByIdAndUpdate(
            itemId,
            { $set: updateData },
            { new: true },
        );

        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }

        const shop = await Shop.findOne({ owner: req.user?.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });

        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        return res
            .status(200)
            .json({ data: shop, message: "Item updated successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: editItem", error });
    }
};

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params?.itemId;
        const item = await Item.findById(itemId).populate("shop");
        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }
        return res
            .status(200)
            .json({ data: item, message: "Item found successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getItemById", error });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params?.itemId;
        const item = await Item.findByIdAndDelete(itemId, { new: true });
        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }
        const shop = await Shop.findOne({ owner: req.user?.userId });

        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        shop.items = shop.items.filter((id) => id.toString() !== itemId);
        await shop.save();
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });
        return res
            .status(200)
            .json({ data: shop, message: "Item deleted successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: deleteItem", error });
    }
};

export const getItemsByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const shops = await Shop.find({
            city: { $regex: new RegExp(`${city}$`, "i") },
        });

        const shopIds = shops.map((shop) => shop._id);
        const items = await Item.find({ shop: { $in: shopIds } });

        res.status(200).json({ data: items });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getItemsByCity", error });
    }
};

export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query;

        if (!query) {
            return res
                .status(400)
                .json({ message: "Query is required for searching" });
        }

        // Search options base
        const filter = {
            name: { $regex: new RegExp(query, "i") },
        };

        // If city is provided, first filter via shop cities
        let shopIds = null;
        if (city && city !== "undefined" && city !== "null") {
            const shops = await Shop.find({
                city: { $regex: new RegExp(`${city}$`, "i") },
            });
            shopIds = shops.map((s) => s._id);
        }

        // If we strictly filtered by city, apply it to the item search
        if (shopIds !== null) {
            filter.shop = { $in: shopIds };
        }

        const items = await Item.find(filter).populate("shop");

        return res.status(200).json({ data: items });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: searchItems", error });
    }
};

export const rating = async (req, res) => {
    try {
        const { itemId, rating } = req.body;

        if (!itemId || !rating) {
            return res
                .status(400)
                .json({ message: "Item ID and rating are required" });
        }
        if (rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be between 1 and 5" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }

        const newCount = item.rating.count + 1;
        const newAvg =
            (item.rating.avg * item.rating.count + rating) / newCount;

        item.rating.avg = newAvg;
        item.rating.count = newCount;
        await item.save();

        return res
            .status(200)
            .json({ data: item, message: "Rating submitted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error: rating", error });
    }
};

export const getGuestItems = async (req, res) => {
    try {
        // 1. Fetch top 8 items sorted by average rating in descending order
        const topRatedItems = await Item.find({ "rating.avg": { $gt: 0 } })
            .sort({ "rating.avg": -1 })
            .limit(8)
            .populate("shop", "name image _id");

        // 2. Fetch random items to pad the list, excluding those already in topRatedItems
        const topRatedIds = topRatedItems.map((item) => item._id);
        const randomItems = await Item.aggregate([
            { $match: { _id: { $nin: topRatedIds } } },
            { $sample: { size: 8 } },
        ]);

        // Manually populate shop references for random aggregated items since aggregate doesn't run
        await Item.populate(randomItems, {
            path: "shop",
            select: "name image _id",
        });

        // Combine both lists
        const guestItems = [...topRatedItems, ...randomItems];

        return res.status(200).json({
            data: guestItems,
            message: "Guest items fetched successfully.",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getGuestItems", error });
    }
};
