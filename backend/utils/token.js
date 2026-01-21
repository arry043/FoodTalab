import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return token;
    } catch (error) {
        console.log("Token Generation Error: ", error);
    }
};

export default generateToken;
