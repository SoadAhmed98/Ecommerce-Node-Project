import UserModel from "../../../db/models/user.model.js";
import bcrypt, { hashSync } from 'bcrypt'
import jwt from "jsonwebtoken";
import SendOurEmails from "../../../utils/SendOurEmail.js"
import verifySucc from "../../../utils/verifiedSuccessfully.js";

export const SignUp=async(req,res)=>{
    
    let {name,email,password,conf_password,address,role}= req.body
    let foundedUser = await UserModel.findOne({email});
    console.log(foundedUser);
    if(!foundedUser){
        // console.log(req.body);
        let hashedPassword=bcrypt.hashSync(password,10);
        if(req.body.role){
        var addedUser=await UserModel.insertMany({name,email,password:hashedPassword,address,role});
        }else{
        var addedUser=await UserModel.insertMany({name,email,password:hashedPassword,address});
        }

        let token =jwt.sign({id:addedUser[0]._id,email:addedUser[0].email},"verifyAccount")
        SendOurEmails({email,url:`http://localhost:3300/user/verify/${token}`,name});
        res.json({"message":"Done","user":addedUser})
        
    }else{
        res.json({"message":"You already registered"});
    }
    
}

export const SignIn=async (req,res)=>{
    let {email,password}=req.body;
    let foundedUser=await UserModel.findOne({email,isVerified:true})
    if(!foundedUser) return res.json({"message":"user not registerd , please register first , or verify your account"})
    let matched=bcrypt.compareSync(password,foundedUser.password);
    if(!matched) return res.json({"message":"invalid password"})
    let token =jwt.sign({id:foundedUser._id,name:foundedUser.name,role:foundedUser.role},"iti44")
    res.json({"message":"welcome",token})
}

export const verifyAccount = (req,res)=>{
    jwt.verify(req.params.token,"verifyAccount",async function(err,decoded){
       
        if(err) return res.json({"message":"invalid token"})
        await UserModel.findByIdAndUpdate(decoded.id,{isVerified:true},{new:true})
        verifySucc(decoded.email)
        res.json({"message":"your account verified successfully"})
     })
}
export const forgetPassword = async (req,res)=>{
    let {email}=req.body;
    let foundedUser= await UserModel.findOne({email,isVerified:true})
    if(!foundedUser) return res.json({"message":"user not registerd , please register first , or verify your account"})
    let token =jwt.sign({id:foundedUser._id,email:foundedUser.email},"resetPassword",{expiresIn:'10m'})
    return res.json({"message":"forget password",token});
}
export const resetPassword = async (req,res)=>{
    let {password}=req.body;
    let hashedPassword=bcrypt.hashSync(password,10);
    let UpdatedUser=await UserModel.findByIdAndUpdate(req.userId,{password:hashedPassword},{new:true})
    return res.json({"message":"Password reset successfully",UpdatedUser});
}
export const userUpdate =async(req,res)=>{
    let {email}=req.body;
    let foundedUser= await UserModel.findOne({email})
    if(!foundedUser) return res.json({"message":"Not registerd User"})
    let UpdatedUser = await UserModel.findByIdAndUpdate(foundedUser._id,{isVerified:false},{new:true})
    res.json({message:"User Updated Successfully",UpdatedUser});

}