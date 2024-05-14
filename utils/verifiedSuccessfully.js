import nodemailer from "nodemailer";
import verifiedTemp from "./verifiedTemplate.js";

export default async function verifySucc(email){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "soadahmed1498@gmail.com",
          pass: "lbye cpkk jvpv wxev",
        },
      });
      const info = await transporter.sendMail({
        from: '<soadahmed1498@gmail.com>', // sender address
        to:email, // list of receivers
        subject:"E-commerce Application", // Subject line
        html: verifiedTemp(), // html body
      });
    
      console.log("Message sent: %s", info.messageId);
}