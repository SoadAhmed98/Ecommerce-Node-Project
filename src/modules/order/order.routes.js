import express from "express";
import { validation } from "../../middlewares/validation.js";
import { AddOrderSchema, ChangeOrderStatusSchema } from "./order.validation.js";
import { auth } from "../../middlewares/authentication.js";
import { AddOrder, AllOrders,ChangeOrderStatus,DeleteOrder,GetSpecificOrder, GetUserOrders } from "./order.controller.js";
import { isAdmin } from "../../middlewares/authorization.js";

const OrderRoutes=express.Router();

OrderRoutes.post("/order/addOrder",validation(AddOrderSchema),auth(),AddOrder)
OrderRoutes.get("/order/allOrders",isAdmin(),AllOrders)
OrderRoutes.get("/order/getSpecificOrder/:id",isAdmin(),GetSpecificOrder)
OrderRoutes.get("/order/getUserOrders",auth(),GetUserOrders)
OrderRoutes.put("/order/changeOrderStatus/:id",validation(ChangeOrderStatusSchema),isAdmin(),ChangeOrderStatus)
OrderRoutes.delete("/order/deleteOrder/:id",auth(),DeleteOrder)

export default OrderRoutes;