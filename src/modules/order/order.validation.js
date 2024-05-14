import joi from "joi";
export const AddOrderSchema = joi.object({
    cartId: joi.string().hex().length(24).required(),
    shippingAddress: joi.string().required(),
    shippingPrice: joi.number().default(0),
    status: joi.string().valid('Pending', 'Confirmed', 'Shipped', 'Delivered').default('Pending')
});
export const ChangeOrderStatusSchema = joi.object({
    status: joi.string().valid('Pending', 'Confirmed', 'Shipped', 'Delivered').required()
});