import jwt from "jsonwebtoken";

export const resetPass=()=>{
return(req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token,"resetPassword",async function(err,decoded){
       
       if(err) return res.json({"message":"invalid token"})
        req.userId=decoded.id;
        // req.userEmail=decoded.email;
        next();
    })
}
}