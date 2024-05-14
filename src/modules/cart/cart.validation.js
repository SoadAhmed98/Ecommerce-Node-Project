import joi from "joi";

const productSchema = joi.object({
    productId: joi.string().hex().length(24).required(),
    quantity: joi.number().required(),
    price: joi.number().required()
});

export const CreateCartSchema = joi.object({
    products: joi.array().items(productSchema).required()
});

export const ApplyCouponSchema=joi.object({
    cartId:joi.string().hex().length(24).required(),
    couponCode: joi.string().required()
})

export const UpdateCartSchema = joi.object({
    products: joi.array().items(productSchema).required()
});