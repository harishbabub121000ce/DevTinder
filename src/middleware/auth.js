import jwt from "jsonwebtoken";

const userAuth = async (req,res,next)=> {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }
        // verify the token
        const decoded = jwt.verify(token, "Hacker@123");
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export default userAuth;