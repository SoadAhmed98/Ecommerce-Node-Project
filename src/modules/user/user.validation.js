import joi from "joi"

const addressSchema = joi.object({
  street: joi.string().required(),
  city:joi.string().required()
});

export const signUpShcema=joi.object({
    name:joi.string().alphanum().min(3).max(30).required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','pro'] } }),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,8}$')),
    conf_password:joi.ref("password"),
    role:joi.string().valid('user', 'admin').optional(),
    address:joi.array().items(addressSchema).required()
})

export const signInShcema=joi.object({
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','pro'] } }),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,8}$')),
})

export const forgetPassSchema=joi.object({
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','pro'] } })
})

export const resetPassSchema=joi.object({
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,8}$')),
    conf_password:joi.ref("password")
})

export const updateUserSchema=joi.object({
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','pro'] } })
})