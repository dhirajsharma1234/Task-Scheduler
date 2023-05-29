import { UserModel } from "../../model/user.js";
import { status } from "../../config/status.js";
import { message } from "../../config/message.js";
import { encryptPass,decryptPass } from "../../service/encryptDecryptPass.js";
import { generateToken } from "../../service/createToken.js";
import { generateOtp } from "../../util/generateOtp.js";
import { sendingMail } from "../../service/verificationMail.js";
import { sendResponse } from "../../util/sendResponse.js";
//generate random bytes
import crypto from "crypto";

class User {
    register = async(req,res) =>{
        try {
            const { name, email, phone, password, isVerified } = req.body;

            if(!name || !email || !phone || !password) {
                return sendResponse(res,status.NOT_ACCEPTABLE,message.EMPTY_FIELD);
            }

            const userExist = await UserModel.findOne({ email });

             //15 * 60 * 1000
            const expiresIn = Date.now() + 900000; // 15 minutes expiration
            const randomBytes = crypto.randomBytes(4).toString("hex");
            const url = `http://localhost:8001/api/user/verify/${randomBytes}`;

            if(userExist) {
                 //verify user
                 if (!userExist.isVerified) {
                    await sendingMail(userExist, "VERIFY", url);
                    return sendResponse(res,status.CREATED,message.SENDING_LINK);
                  }
                  return sendResponse(res,status.BAD_REQUEST,message.ALREADY_REGISTERED);
            }
            
            const encryptedPass = await encryptPass(password);
            
            const userData = {
                name, 
                email, 
                phone, 
                password:encryptedPass, 
                isVerified:false,
                token:randomBytes,
                tokenExpires:expiresIn,
            };
            
            const mongoInstance = new UserModel(userData);
            
            const user = await mongoInstance.save();

            
            const token = await generateToken(user);

            await sendingMail(userData, "VERIFY", url);

            return sendResponse(res,status.CREATED,message.SENDING_LINK);
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    verifyUser = async(req,res) =>{
        try {
            const { token } = req.params;
            
            const user = await UserModel.findOne({ token, tokenExpires:{ $gt: Date.now() } });


            if(!user) {
                return res.status(200).json({staus:status.NOT_ACCEPTABLE,message:message.TOKEN_EXPIRED});
            }

            //remove field
            const updateData = await UserModel.findOneAndUpdate({ token },{ 
                $set:{     
                    isVerified:true
                },
                $unset: {
                    token:1,    
                    tokenExpires:1
            } })


            return res.status(200).json({staus:status.SUCCESS,message:message.VERIFIED_SUCCESS});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    //login
    login = async(req,res) =>{
        try {
            const { email,password } = req.body;

            if(!email || !password) {
                return res.status(406).json({status:status.NOT_ACCEPTABLE,message:message.EMPTY_FIELD});
            }


            const user = await UserModel.findOne({ email });

            if(!user) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            //compare password
            const compPass = await decryptPass(password,user);

            console.log(compPass);
            if(!compPass || !user.isVerified) {
                return res.status(400).json({status:status.BAD_REQUEST,message:message.LOGIN_FAILED});
            }

            const token = await generateToken(user);

            return res.status(200).json({status:status.SUCCESS,message:message.LOGIN_SUCCESS,token});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }

    //get user
    getUser = async(req,res) =>{
        try {
            const userId = req.user._id;

            const user = await UserModel.findOne({_id:userId});

            if(!user) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            return res.status(200).json({status:status.SUCCESS,data:user});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }

    //upadate user name and phone
    updateUser = async(req,res) =>{
        try {
            const userId = req.user._id;
            const {name,phone} = req.body;

            const user = await UserModel.findOne({_id:userId});

            if(!user) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            await UserModel.findByIdAndUpdate(userId,{
                name,phone
            });

            return res.status(200).json({status:status.SUCCESS,message:message.USER_UPDATE});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }

    updateEmailUsingOtp = async(req,res) =>{
        try {
            const { newEmail } = req.body;
            const userId = req.user._id;

            // Instead of awaiting each asynchronous operation one by one, you can use Promise.all to execute multiple asynchronous operations concurrently. This can help reduce the overall execution time of the API.
            const [alreadyExistUser, user] = await Promise.all([
                UserModel.findOne({ email: newEmail }),
                UserModel.findOne({ _id: userId }),
              ]);

            
             if(alreadyExistUser) {
                return res.status(400).json({status:status.BAD_REQUEST,message:message.ALREADY_REGISTERED});
            }

            if(!user) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }


            //generate otp and time
            const randomOtp = generateOtp(6);
            const otpTime = new Date();
            
            //send mail for Otp
            await sendingMail(newEmail,"OTP",randomOtp);
            
            await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { otp: randomOtp, otpExpiry: otpTime } },
                { new: true }
            );
              
            return res.status(200).json({status:status.SUCCESS,message:message.OTP_SENT});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }

    //update email 
    updateEmail = async(req,res) => {
        try {
            const { newEmail,otp } = req.body;
            const {_id} = req.user;

            const user = await UserModel.findOne({ _id,otp });

            if(!user) {
                return res.status(404).json({ status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            // const date = new Date();
            // const threeMinute = 3 * 60 * 1000;
            // if(date - user.otpExpiry  > threeMinute){
            //     return res.status(400).json({ status:status.NOT_FOUND,message:message.OTP_EXPIRED});
            // }


            const currentTime = new Date().getTime();
            const otpExpiryTime = user.otpExpiry.getTime();
            const threeMinutes = 3 * 60 * 1000;

            if (currentTime > otpExpiryTime + threeMinutes) {
            return res.status(400).json({ status: status.BAD_REQUEST, message: message.OTP_EXPIRED });
            }

            user.email = newEmail;
            await user.save();

            return res.status(200).json({ status:status.SUCCESS,message:message.EMAIL_UPDATE});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }

    //update password
    updatePassword = async(req,res) =>{
        try {
            const { otp,oldPassword,newPassword } = req.body;
            const userId = req.user._id;

            if(!otp || !oldPassword || !newPassword) {
                return res.status(406).json({ status:status.NOT_ACCEPTABLE,message:message.EMPTY_FIELD});
            }

            //get user 
            const user = await UserModel.findOne({ _id:userId,otp });

            if(!user) {
                return res.status(404).json({ status:status.NOT_FOUND,message:message.NOT_FOUND});
            }   

            //check old password
            const compPassword = await decryptPass(oldPassword,user);

            if(!compPassword){
                throw new Error(message.PASSWORD_MISMATCH);
            }

            if(oldPassword === newPassword) {
                throw new Error(message.PASSWORD_SAME);
            }

            //check expiry time
            const date = new Date();
            const expiryTime = 3 * 60 * 1000;

            if(date - user.otpExpiry > expiryTime) {
                return res.status(400).json({ status:status.NOT_FOUND,message:message.OTP_EXPIRED});
            }

            //hash password
            const password = await encryptPass(newPassword);

            await UserModel.findOneAndUpdate({_id:userId}, {
                $set:{
                    password
                }
            },
            {
                new:true
            })

            return res.status(200).json({ status:status.SUCCESS,message:message.PASSWORD_UPDATE});
        } catch (error) {
            return res.status(400).json({ status:status.BAD_REQUEST,message:error.message});
        }
    }
}

const userObj = new User();
export { userObj };
