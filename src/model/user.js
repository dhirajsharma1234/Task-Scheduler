import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        minLength:10,
        maxLength:10,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    tokenExpires: {
        type: Date,
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:Date
    }
},
{
    timestamps:true
});

const UserModel = new mongoose.model("user",userSchema);

export {UserModel};