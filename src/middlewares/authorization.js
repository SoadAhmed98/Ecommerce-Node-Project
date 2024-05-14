import jwt from "jsonwebtoken";

export const isAdmin=()=>{
return(req,res,next)=>{
    let token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token,"iti44",async function(err,decoded){
       
       if(err) return res.json({"message":"invalid token"})
       if(decoded.role != "admin") return res.status(401).json({"message":"You Are Not Authorized to do this action"})
        req.userId=decoded.id;
        next();
    })
}
}