
import { ObjectId } from 'mongodb';
import ProductModel from '../../../db/models/product.model.js';
import CartModel from '../../../db/models/cart.model.js';
import CouponModel from '../../../db/models/coupon.model.js';
import { AfterToday } from '../../../helper/checkOnExpiration.js';
import mongoose from 'mongoose';
import arraysEqual from '../../../helper/compareCartProducts.js';

export const CreateCart=async (req,res)=>{
   
    try {
        
        let {products} = req.body;
        let userId=req.userId;
        // console.log(req.body);
       
        const userCart = await CartModel.findOne({ userId:userId});
        if (userCart) return res.json({"message": "Cart Already Exist, You can Update it if you want to update something"});
        let totalPrice=0;
       
        for (const product of products) {
            // Check if product already exists (you can replace this with your actual logic)
            const productData = await ProductModel.findById({ _id: product.productId });
        
            if (!productData) {
                return res.json({ "message":`Product with ID ${product.productId} doesn't exist`});
            }
        
            // Perform any additional actions if the product exists
            if (product.quantity > productData.stock) {
                return res.json({ "message": `There is not enough quantity available for Product with ID ${product.productId}. The available quantity is ${productData.stock}` });
            }
            if(product.quantity == 0){
                return res.json({ "message": `quantity should be at least 1 for Product with ID ${product.productId}.` });
            }
            // Check if the provided price matches the product price
            if (product.price != productData.finalPrice) {
                return res.json({ "message": `There is a mistake in the price you entered for Product with ID ${product.productId}. The price should be ${productData.finalPrice}` });
            }
        
            // Update totalPrice
            totalPrice += parseInt(product.quantity) * parseInt(product.price);
        }
        // console.log(totalPrice);
      
        let createdCart = await CartModel.insertMany({
            userId: userId,
            totalPrice: totalPrice,
            products: products
        });
        // for(const product of products){
        //      const productData = await ProductModel.findById({ _id: product.productId });
        //      await ProductModel.findByIdAndUpdate(product.productId, {stock:productData.stock-product.quantity}, { new: true });
        // }

       
        return res.json({"message":"Cart Created Successfully",createdCart})
    } catch (error) {
         await session.abortTransaction();
        res.status(500).json({
            "message": "Failed to Create Cart"
        });
    }
   
}

export const ApplyCouponOnCart=async (req,res)=>{
 
 try {
        
    let {cartId,couponCode}=req.body;
    let CartId = new ObjectId(cartId);
    let cart= await CartModel.findById({_id:CartId});
    if(!cart) return res.json({"message":"This Cart dosen't exist"});

    /*****************check if there is a product with applied coupon******************/
    async function processProducts() {
        var array = [];
        for (const product of cart.products) {
            const productData = await ProductModel.findById({ _id: product.productId });
            if (productData && productData.price != productData.finalPrice) {
                array.push(productData._id);
            }
        }
        return array;
    }
    
    let productHasCoupon=await processProducts();
    // console.log(productHasCoupon.length);
    if (productHasCoupon.length>0) {
        return res.json({ "message": "There is already a product with an applied coupon in the cart" });
    }
    /**********************************************************************************/
    const coupon = await CouponModel.findOne({couponCode: couponCode});

    if (!coupon) return res.json({
        "message": "Coupon Dosen't Exist"
    });
    let expirationInvalid=AfterToday(coupon.expireIn);

    if(expirationInvalid){
        return res.json({"message":"This Coupon Expired"})
    }
    let updateFields={};
    updateFields.priceAfterdiscount=cart.totalPrice-coupon.value;
    updateFields.coupon = {}; 

    // Set couponId and couponCode properties
    updateFields.coupon.couponId = coupon._id;
    updateFields.coupon.couponCode = coupon.couponCode;
    let updatedCart= await CartModel.findByIdAndUpdate(CartId, updateFields, { new: true });
    return res.json({"message":"Coupon Applied To Your Cart Successfully",updatedCart})
} catch (error) {
    console.error(error);
    res.status(500).json({ "message": "Failed to Apply Coupon on your cart" });
}

}

export const UpdateCart = async (req, res) => {
 
    // try {

        let { products } = req.body;
        let userId = req.userId;
        let cartId = req.params.id;

        // Retrieve the Cart data by ID
        let cartData = await CartModel.findOne({ _id: cartId, userId: userId });
        if (!cartData) return res.json({ "message": "Cart not found" });

        // Store old data to know what's different and change stock 
        let oldProducts = cartData.products;
        console.log(req.userId,cartData.userId.toHexString())
        if (!products.length) return res.json({ "message": "Products can't be empty" });
        if (req.role != "admin" ){
            if(req.userId != cartData.userId.toHexString()){
                return res.status(401).json({ "message": "Not authorized to perform this action" });
            }
        }
           
        let totalPrice = 0;

        for (const product of products) {
            // Check if product already exists
            const productData = await ProductModel.findById(product.productId);

            if (!productData) {
                return res.json({ "message": `Product with ID ${product.productId} doesn't exist` });
            }

            // Perform any additional actions if the product exists
            if (product.quantity > productData.stock) {
                return res.json({ "message": `There is not enough quantity available for Product with ID ${product.productId}. The available quantity is ${productData.stock}` });
            }

            // Check if the provided price matches the product price
            if (product.price != productData.finalPrice) {
                return res.json({ "message": `There is a mistake in the price you entered for Product with ID ${product.productId}. The price should be ${productData.finalPrice}` });
            }

            // Update totalPrice
            totalPrice += parseInt(product.quantity) * parseInt(product.price);
        }

        let newProducts = products;
        //check if oldProducts Are same new product's without any change
       
        let checkProducts =  arraysEqual(oldProducts,newProducts);
        console.log(checkProducts);
        if (checkProducts)
            return res.json({ "message": "You Don't Perform Any Changes on Cart products." });

        let updateFields = {};
        updateFields.totalPrice = totalPrice;
        updateFields.products = newProducts;
        updateFields.priceAfterdiscount = totalPrice;

        // let updatedCart = await CartModel.findByIdAndUpdate(cartId, updateFields, { new: true });

        // for (const product of newProducts) {
        //     const oldProduct = oldProducts.find(obj => obj.productId == product.productId);
        //     const productData = await ProductModel.findById(product.productId);
        //     if (oldProduct && product.quantity != oldProduct.quantity) {
        //         const quantityDifference = parseInt(product.quantity) - oldProduct.quantity;
    
        //         if(quantityDifference>0){
        //             await ProductModel.findByIdAndUpdate(product.productId, { stock: productData.stock - quantityDifference }, { new: true });
        //         }else{
        //             await ProductModel.findByIdAndUpdate(product.productId, { stock: productData.stock + Math.abs(quantityDifference) }, { new: true });

        //         }
        //     }
        // }

      
        // return res.json({ "message": "Cart updated successfully", updatedCart })

    // } catch (error) {
      
    //     res.status(500).json({
    //         "message": "Failed to update cart"
    //     });
    // }
}
