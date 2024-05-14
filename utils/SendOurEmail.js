import nodemailer from "nodemailer";
import emailTemp from "./emailTemplate.js";
var notice="Please verify your account";
export default async function SendOurEmails(options){
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
        to: options.email, // list of receivers
        subject:"E-commerce Application", // Subject line
        html: emailTemp(options.url,notice,options.email,options.name), // html body
      });
    
      console.log("Message sent: %s", info.messageId);
}