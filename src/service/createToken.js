import jwt from "jsonwebtoken";

const generateToken = async(user) =>{
    try {
        const token = await jwt.sign({ _id:user._id, date: Date.now() / 1000 },process.env.SECRET_KEY,{ expiresIn:"1h" });
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}

const verifyToken = async(user) =>{
    try {
        const token = await jwt.sign({ _id:user._id, date: Date.now() / 1000 },process.env.SECRET_KEY,{ expiresIn:"1h" });
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}



export { generateToken,verifyToken };