
const generateOtp = (length) =>{
    const num = "0123456789";
    let otp = "";

    for(let i=0;i<length;i++) {
        const randomIndex = Math.floor(Math.random() * num.length);
        otp += num[randomIndex];
    }
    return otp;
}

export { generateOtp };