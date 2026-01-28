import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ data: user });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: getCurrentUser", error });
    }
};

export const updateUserLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user?.userId,
            {
                location: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
            },
            { new: true },
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res
            .status(200)
            .json({ message: "Location updated successfully" }); 
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error: updateUserLocation", error });
    }
};
