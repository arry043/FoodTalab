import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) =>  {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized 1" });
        }
    
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodeToken){
            return res.status(401).json({ message: "Unauthorized 2" });
        }
        console.log(decodeToken);
        req.user = decodeToken;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server Error: isAuth", error });
    }
}