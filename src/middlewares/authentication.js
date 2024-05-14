import jwt from "jsonwebtoken";

export const auth=()=>{
return(req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token,"iti44",async function(err,decoded){
       
       if(err) return res.json({"message":"invalid token"})
        req.userId=decoded.id;
        req.role=decoded.role;
        next();
    })
}
}