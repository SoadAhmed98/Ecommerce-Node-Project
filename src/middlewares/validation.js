import joi from "joi";
export const validation =(schema)=>{
    return (req,res,next)=>{
        let errors=schema.validate(req.body,{abortEarly:false});
        if(errors?.error){
            res.json({"message":"validation error","details":errors?.error?.details})
          }else{
            next();
          }
    }
}

export const queryValidation = (querySchema) => {
    return (req, res, next) => {
        let queryErrors = querySchema ? querySchema.validate(req.query, { abortEarly: false }) : null;
        if (queryErrors?.error) {
            res.json({ "message": "Validation error", "details": queryErrors?.error?.details});
        } else {
            next();
        }
    }
}

