import CartModel from '../../../db/models/cart.model.js';
import OrderModel from '../../../db/models/order.model.js';
import { ObjectId } from 'mongodb';



export const AddOrder= async (req,res)=>{
    // try {
        let userId=req.userId;
        let { cartId, shippingAddress, shippingPrice } = req.body;
        let CartId= new ObjectId(cartId);

        const ExistOrder = await OrderModel.findOne({ cartId:CartId,userId:userId});
        if (ExistOrder) return res.json({"message": "This Order aleady Exist"});
        
        var cartData = await CartModel.findOne({ _id: CartId, userId: userId });
        
        if (!cartData) return res.json({ "message": "Cart not found" });
        
        let insertedFields = {};
        insertedFields.userId=userId;
        insertedFields.cartId=CartId;
        insertedFields.shippingAddress=shippingAddress;
        

        if(shippingPrice){
            let totalAmount=cartData.priceAfterdiscount+parseInt(shippingPrice);
            insertedFields.shippingPrice=shippingPrice;
            insertedFields.totalAmount=totalAmount
        }else{
            let totalAmount=cartData.priceAfterdiscount;
            insertedFields.totalAmount=totalAmount
        }
        
        // Create the order
        const order = await OrderModel.insertMany(insertedFields);

        res.json({ message: "Order created successfully", order });
    // } catch (error) {
    //     res.status(500).json({ message: "Error creating order" });
    // }
}

export const AllOrders= async (req,res)=>{
    try {
        let allOrders = await OrderModel.find();
        if (!allOrders.length) return res.json({
            "message": "No Orders Found"
        })
        res.json({
            "messages": "all Orders",
            allOrders
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Orders Data"
        });
    }
}

export const GetSpecificOrder= async (req,res)=>{
    try {
        let orderId = req.params.id;
        let orderData = await OrderModel.findById({
            _id: orderId
        });
        if(!orderData) return res.status(500).json({"message":"Order Not Found"})
        res.status(200).json({
            "message": "Order data ",
            orderData
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Order Data"
        });
    }
}
export const GetUserOrders= async (req,res)=>{
    try {
        let userId=new ObjectId(req.userId);
        let allOrders = await OrderModel.findOne({ userId:userId});
            if (!allOrders) return res.json({
                "message": "No Orders Found For This User"
            })
            res.json({
                "messages": "all User Orders",
                allOrders
            });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Orders Data"
        });
    }
}

export const ChangeOrderStatus= async (req,res)=>{
    try {
        let orderId = req.params.id;
        let {status}=req.body;
        let orderData = await OrderModel.findById({
            _id: orderId
        });
        if(!orderData) return res.status(500).json({"message":"Order Not Found"})
        let updateFields={};
        updateFields.status=status;
        let updatedOrder= await OrderModel.findByIdAndUpdate(orderId,updateFields, { new: true })
        res.json({ message: "Order status updated successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error Updating Order Status" });
    }
}

export const DeleteOrder= async (req,res)=>{

    try {
        let orderId = req.params.id;
      
        let orderData = await OrderModel.findById({
            _id: orderId
        });
        // res.json({orderData})

        let deleteOrder=await OrderModel.findByIdAndDelete(orderId)
        res.json({ message: "Order deleted successfully", deleteOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to Delete Order" });
    }
}