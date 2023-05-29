import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.js";
import { message } from "../config/message.js";

const verifyToken = async(token) =>{
    try {
        const decode = await jwt.verify(token,process.env.SECRET_KEY);

        //check user
        const user = await UserModel.findOne({ _id: decode._id});

        if(!user) {
            throw new Error(message.AUTH_FAILED);
        }

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export {verifyToken};