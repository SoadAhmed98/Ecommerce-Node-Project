export default function ErrorHandeler(err,req,res,next){

    if(err){
      return  res.json({"message":err});
    }
}