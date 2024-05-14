import mongoose from "mongoose"

export const initConnection = ()=>{
  mongoose.connect(`mongodb://127.0.0.1:27017/Ecommerce_node_project`)
  .then(()=> console.log("Database Connected"))
  .catch((err)=>console.log("Database error",err))
}