import transporter from "../config/email.js";

const sendingMail = async(user,type,data) =>{
    try {
        if(type === "VERIFY") {
            console.log("sending mail");
            await transporter.sendMail({
                from:process.env.USER,
                to:user.email,
                subject:"Verify",
                text:"",
                html:`<h2>click here to verify:</h2><p>click this link to activate your account.</p><h4 style="color:blue"><a href='${data}'>click here</a></h4>`
            });
            return;
        }
        if(type === "OTP") {
            await transporter.sendMail({
                from:process.env.USER,
                to:user,
                subject:"OTP",
                text:"",
                html:`<h2>Verify Otp:</h2><p>Use this otp to update your email.</p><h4 style="color:blue">${data}</h4>`
            });
            return;
        }
    } catch (error) {
        console.log(error); 
        throw new Error(error.message);
    }
}

export { sendingMail };