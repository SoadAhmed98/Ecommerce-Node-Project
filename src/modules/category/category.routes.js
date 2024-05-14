import express from "express";
import { auth } from "../../middlewares/authentication.js";
import { AddCategorySchema, UpdateCategorySchema } from "./category.validation.js";
import { AddCategory ,AllCategory, DeleteCategory, SpecificCategory, UpdateCategory, upload } from "./category.controller.js";
import { validation } from "../../middlewares/validation.js";
const CategoryRoutes=express.Router();

CategoryRoutes.get("/category/allCategory",AllCategory)
CategoryRoutes.get("/category/SpecificCategory/:id",SpecificCategory)
CategoryRoutes.post("/category/addCategory",upload.single('image'),validation(AddCategorySchema),auth(),AddCategory)
CategoryRoutes.put("/category/updateCategory/:id",upload.single('image'),validation(UpdateCategorySchema),auth(),UpdateCategory)
CategoryRoutes.delete("/category/DeleteCategory/:id",auth(),DeleteCategory)


export default CategoryRoutes;