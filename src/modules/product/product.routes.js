import express from "express";
import { AddProduct, AllProduct, AllProductSameCat, SpecificProduct, upload ,UpdateProduct ,DeleteProduct} from "./product.controller.js";
import { queryValidation, validation } from "../../middlewares/validation.js";
import { AddProductSchema, AllProductSchema ,UpdateProductSchema} from "./product.validation.js";
import { auth } from "../../middlewares/authentication.js";
const ProductRoutes=express.Router();


ProductRoutes.get("/product/allProducts",queryValidation(AllProductSchema),AllProduct);
ProductRoutes.get("/product/productsOfSameCategory/:id",queryValidation(AllProductSchema),AllProductSameCat);
ProductRoutes.get("/product/SpecificProduct/:id",SpecificProduct);
ProductRoutes.post("/product/addProduct",upload.single('image'),validation(AddProductSchema),auth(),AddProduct);
ProductRoutes.put("/product/updateProduct/:id",upload.single('image'),validation(UpdateProductSchema),auth(),UpdateProduct)
ProductRoutes.delete("/product/deleteProduct/:id",auth(),DeleteProduct);

export default ProductRoutes;