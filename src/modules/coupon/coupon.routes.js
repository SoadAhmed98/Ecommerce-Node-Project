import express from "express";
import { validation } from "../../middlewares/validation.js";
import { AddCouponSchema ,ApplyCouponSchema,UpdateCouponSchema} from "./coupon.validation.js";
import { AddCoupon, AllCoupons, ApplyCoupon, DeleteCoupon, UpdateCoupon } from "./coupon.controller.js";
import { auth } from "../../middlewares/authentication.js";
const CouponRoutes=express.Router();

CouponRoutes.get("/coupon/allCoupons",AllCoupons);
CouponRoutes.post("/coupon/addCoupon",validation(AddCouponSchema),auth(),AddCoupon);
CouponRoutes.put("/coupon/updateCoupon/:id",validation(UpdateCouponSchema),auth(),UpdateCoupon);
CouponRoutes.delete("/coupon/deleteCoupon/:id",auth(),DeleteCoupon);
CouponRoutes.post("/coupon/applyCoupon",validation(ApplyCouponSchema),auth(),ApplyCoupon);


export default CouponRoutes;