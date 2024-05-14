import joi from "joi";

export const AllProductSchema=joi.object({
    page: joi.number().integer().min(1).required(),
    limit: joi.number().integer().min(1).required()
});

export const AddProductSchema=joi.object({
    name: joi.string().min(3).max(100).required(),
    price: joi.number().required(),
    category: joi.string().hex().length(24).required(), // Assuming category is represented by its ID
    stock: joi.number().required()

})
export const UpdateProductSchema=joi.object({
    name: joi.string().min(3).max(100).optional(),
    price: joi.number().optional(),
    category: joi.string().hex().length(24).optional(), // Assuming category is represented by its ID
    stock: joi.number().optional(),
    createdBy:joi.string().hex().length(24).optional()
})
