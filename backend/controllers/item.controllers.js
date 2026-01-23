import Shop from "../models/shop.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Item from "../models/item.model.js";

export const addItem = async (req, res) => {
    try {
        const { name, description, price, foodType, category } = req.body;
        let image = null;
        if (req.file) {
            image = await uploadOnCloudinary(req.file?.path);
        }

        const shop = await Shop.findOne({ owner: req.user?._id });
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        const newItem = await Item.create({
            name,
            description,
            price,
            foodType,
            category,
            image,
            shop: req.user?.shop?._id,
        });
        if (newItem) {
            return res
                .status(200)
                .json({ data: newItem, message: "Item added successfully" });
        }
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
        const item = await Item.findByIdandUpdate(
            itemId,
            {
                $set: {
                    name,
                    description,
                    price,
                    foodType,
                    category,
                    image,
                },
            },
            { new: true },
        );
        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }
        return res
            .status(200)
            .json({ data: item, message: "Item updated successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: editItem", error });
    }
};
