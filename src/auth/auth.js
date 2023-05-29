import { verifyToken } from "../service/verifyToken.js";
import { status } from "../config/status.js";
import { message } from "../config/message.js";

const authUser = async(req,res,next) =>{
    try {
        const token = req.headers.authorization?.replace("Bearer ","");

        if(!token) {
            throw new Error("Token Required");
        }

        //decode token 
        const decodeToken = await verifyToken(token);

        if(!decodeToken){
            throw new Error(message.AUTH_FAILED);
        }

        req.user = decodeToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({status:status.UNAUTHORIZED,message:message.AUTH_FAILED});
    }
}

export { authUser };