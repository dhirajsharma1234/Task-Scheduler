import { userObj } from "../../controllers/user/user.js";
import { authUser } from "../../auth/auth.js";
import express from "express";
const router = new express.Router();

//sign-up route
router.route("/register").post(userObj.register);
router.route("/verify/:token").get(userObj.verifyUser);

//sign-in route
router.route("/login").post(userObj.login);
router.route("/").get(authUser,userObj.getUser);

//update user name and phone
router.route("/update").patch(authUser,userObj.updateUser);
//update email and password using otp
router.route("/otp").post(authUser,userObj.updateEmailUsingOtp);
router.route("/otp/update/email").patch(authUser,userObj.updateEmail);
router.route("/otp/update/pin").patch(authUser,userObj.updatePassword);

export default router;