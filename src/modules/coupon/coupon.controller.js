import CouponModel from "../../../db/models/coupon.model.js";
import moment from "moment";
import UserModel from "../../../db/models/user.model.js";
import isEmpty from "../../../helper/checkOnBody.js";
import ProductModel from "../../../db/models/product.model.js";
import { AfterToday, beforeToday} from "../../../helper/checkOnExpiration.js";
import { ObjectId } from 'mongodb';



// Get All Coupon
export const AllCoupons=async (req,res)=>{
    try {
        let allCoupon = await CouponModel.find();
        if (!allCoupon.length) return res.json({
            "message": "No Coupons Found"
        })
        res.json({
            "messages": "all Coupons",
            allCoupon
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Coupons Data"
        });
    }
}
// Add Coupon
export const AddCoupon=async(req,res)=>{
    try {
        let {couponCode,value,expireIn} = req.body;
        // console.log(req.body);
     
        const coupon = await CouponModel.findOne({
            couponCode: couponCode
        });

        if (coupon) return res.json({
            "message": "Coupon Already Exist"
        });
           
        let expirationInvalid=beforeToday(expireIn);

        if(expirationInvalid){
            return res.json({"message":"expiration date is older than current date. Cannot add coupon."})
        }
        let date=moment.utc(expireIn,"DD-MM-YYYY HH:mm").toDate();
        let addedCoupon = await CouponModel.insertMany({
            couponCode: couponCode,
            value: value,
            expireIn:date,
            createdBy: req.userId
        });

        res.json({
            "message": "Coupon Added Successfully"
            ,addedCoupon
        })
      
    } catch (error) {
        res.status(500).json({
            "message": "Failed to Add Coupon Data"
        });
    }
}
//Update Coupon
export const UpdateCoupon=async(req,res)=>{
    try {
        let couponId = req.params.id;
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!couponId) return res.json({ "message": "Invalid Coupon Id" });

        if(isEmpty(req.body)) return res.json({"message":"You Can't Perform Update On Empty Field"});

        let {couponCode,value,expireIn,createdBy} = req.body;

        // Retrieve the coupon data by ID
        let couponData = await CouponModel.findById(couponId);
        if (!couponData) return res.json({ "message": "Coupon not found" });
        console.log(req.role,req.userId);
        // Check if the user is authorized to update the category
        if (req.role == "admin" || req.userId == couponData.createdBy) {
            let updateFields={};
            if(couponCode){
                updateFields.couponCode= couponCode;
            }
            if(value){
                updateFields.value= value;
            }
            if(expireIn){
                let expirationInvalid=beforeToday(expireIn);
                if(expirationInvalid){
                    return res.json({"message":"expiration date is older than current date. Cannot Update coupon."})
                }
                let date=moment.utc(expireIn,"DD-MM-YYYY HH:mm").toDate();
                updateFields.expireIn= date;
            }
            if(createdBy){
                let checkuser=await UserModel.findById({_id:createdBy});
                if(!checkuser) return res.json({"message":"invalid user"});
                updateFields.createdBy= createdBy;
            }
          
            updateFields.updatedBy=req.userId;
            // Update the coupon using its ID
            let updatedCoupon= await CouponModel.findByIdAndUpdate(couponId, updateFields, { new: true });

            res.json({ "message": "Coupon Updated Successfully", updatedCoupon });
        } else {
            res.status(401).json({ "message": "Not Authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Failed to Update Coupon" });
    }
}
//Delete Coupon
export const DeleteCoupon= async (req,res)=>{
    try {
        let couponId = req.params.id;
        // console.log(req.userId);
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!couponId) return res.json({ "message": "Invalid Coupon Id"});

        let couponData = await CouponModel.findById(couponId);
        if (!couponData) return res.json({ "message": "Coupon not found" });

        if (req.role == "admin" || req.userId == couponData.createdBy) {
            await CouponModel.findByIdAndDelete({
                _id: couponId
            });
            res.status(200).json({
                "message": "Coupon Deleted Successfully"
            });
        } else {
            res.status(401).json({
                "message": "Not Authorized to perform this action"
            });
        }

    } catch (error) {
        res.status(500).json({
            "message": "Failed to Delete Coupon"
        });
    }
}
//Apply Coupon To Product
export const ApplyCoupon= async (req,res)=>{
    try {
        
        let {productId,couponCode} = req.body;
        let ProductId = new ObjectId(productId);
        let product= await ProductModel.findById({_id:ProductId});
        if(!product) return res.json({"message":"This Product don't exist"});
        
        const coupon = await CouponModel.findOne({couponCode: couponCode});

        if (!coupon) return res.json({
            "message": "Coupon Dosen't Exist"
        });
        let expirationInvalid=AfterToday(coupon.expireIn);

        if(expirationInvalid){
            return res.json({"message":"This Coupon Expired"})
        }
        let updateFields={};
        updateFields.discount=coupon.value;
        updateFields.finalPrice=product.price-coupon.value;
        updateFields.coupon = {}; 

        // Set couponId and couponCode properties
        updateFields.coupon.couponId = coupon._id;
        updateFields.coupon.couponCode = coupon.couponCode;
        let updatedProduct = await ProductModel.findByIdAndUpdate(ProductId, updateFields, { new: true });
        return res.json({"message":"Coupon Applied To Your Product Successfully",updatedProduct})
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Failed to Apply Coupon on your Product" });
    }
}