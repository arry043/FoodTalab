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
        const item = await Item.findById(itemId);
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
