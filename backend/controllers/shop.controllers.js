import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createAndEditShop = async (req, res) => {
    try {
        // console.log(req);
        const { name, address, city, state, pincode, contact, email } =
            req.body;
        let image = null;
        if (req.file) {
            // console.log(req.file);
            image = await uploadOnCloudinary(req.file?.path);
        }

        let shop = await Shop.findOne({ owner: req.user?.userId });
        if (!shop) {
            const newShop = await Shop.create({
                name,
                address,
                city,
                state,
                pincode,
                contact,
                email,
                image,
                owner: req.user?.userId,
            });

            await newShop.populate("owner");
            return res.status(200).json({
                data: newShop,
                message: "Shop created successfully",
            });
        }

        shop = await Shop.findByIdAndUpdate(
            { _id: shop._id },
            {
                name,
                address,
                city,
                state,
                pincode,
                contact,
                email,
                image,
            },
            { new: true },
        );

        await shop.populate("owner items");
        return res.status(200).json({
            data: shop,
            message: "Shop updated successfully",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Server Error: createShop, ${error}` });
    }
};

export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.user?.userId }).populate(
            "owner items",
        );
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }
        return res.status(200).json({ data: shop });
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Server Error: getMyShop, ${error}` });
    }
};
