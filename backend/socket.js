import User from "./models/user.model.js";

export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("identity", async (userId) => {
            socket.join(userId);
            console.log(`User ${userId} connected with socket ID ${socket.id}`);
            try {
                const user = await User.findByIdAndUpdate(
                    userId,
                    { socketId: socket.id, isOnline: true },
                    { new: true },
                );
            } catch (error) {
                console.error("Error updating user socket ID:", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log(`Socket ${socket.id} disconnected`);
            try {
                await User.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null, isOnline: false },
                    { new: true },
                );
            } catch (error) {
                console.error(
                    "Error clearing user socket ID on disconnect:",
                    error,
                );
            }
        });
    });
};
