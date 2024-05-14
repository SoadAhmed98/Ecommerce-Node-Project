import joi from "joi";

export const AddCategorySchema=joi.object({
    name: joi.string().min(3).max(100).required()
})

export const UpdateCategorySchema=joi.object({
    name: joi.string().min(3).max(100).optional(),
    createdBy:joi.string().hex().length(24).optional()
})