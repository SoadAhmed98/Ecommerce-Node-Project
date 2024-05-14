import joi from "joi";
import JoiDate from '@joi/date';
const joiExtended=joi.extend(JoiDate);


export const AddCouponSchema=joiExtended.object({
    couponCode: joiExtended.string().required(),
    value: joiExtended.number().required(),
    expireIn: joiExtended.date().utc().format('DD-MM-YYYY HH:mm').required()

})
export const UpdateCouponSchema=joiExtended.object({
    couponCode: joiExtended.string().optional(),
    value: joiExtended.number().optional(),
    createdBy: joiExtended.string().hex().length(24).optional(),
    expireIn: joiExtended.date().utc().format('DD-MM-YYYY HH:mm').optional()

})

export const ApplyCouponSchema=joiExtended.object({
    productId:joiExtended.string().hex().length(24).required(),
    couponCode: joiExtended.string().required()
})