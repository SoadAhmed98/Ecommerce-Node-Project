import express from "express";
import { auth } from "../../middlewares/authentication.js";
import { ApplyCouponOnCart, CreateCart, UpdateCart } from "./cart.controller.js";
import { validation } from "../../middlewares/validation.js";
import { ApplyCouponSchema, CreateCartSchema ,UpdateCartSchema} from "./cart.validation.js";

const CartRoutes=express.Router();

CartRoutes.post("/cart/createCart",validation(CreateCartSchema),auth(),CreateCart);
CartRoutes.post("/cart/applyCouponOnCart",validation(ApplyCouponSchema),auth(),ApplyCouponOnCart);
CartRoutes.put("/cart/updateCart/:id",validation(UpdateCartSchema),auth(),UpdateCart);


export default CartRoutes;