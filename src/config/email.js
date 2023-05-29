import nodemailer from "nodemailer";


const transporter =  nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER, // generated ethereal user
            pass: process.env.PASS // generated ethereal password
        },
});

export default transporter;