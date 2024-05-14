import mongoose from "mongoose";
import moment from "moment";
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    priceAfterdiscount: {
        type: Number,
        default: function () {
            return this.totalPrice; // Set finalPrice default value to priceAfterDiscount
        }

    },   
     coupon: {
        
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon' // Reference to the coupon applied to this product
        },
        couponCode: {
            type: String // Coupon code applied to this product
        }
    }
    ,
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
}, { 

    timestamps: { currentTime: () => moment().add(2, 'hours').toDate()}
    // timestamps: { currentTime: () => new Date(Date.now() + 2 * 60 * 60 * 1000) // Add 2 hours to the current time}

   }
   );

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
