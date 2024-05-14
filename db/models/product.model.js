import mongoose from "mongoose";
import moment from "moment";
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default:0
        
    },
    finalPrice: {
        type: Number,
        default: function () {
            return this.price; // Set finalPrice default value to price
        }
    },
    coupon: {
        // couponId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Coupon' // Reference to the coupon applied to this product
        // },
        // couponCode: {
        //     type: String // Coupon code applied to this product
        // }
        type: Object
    },
    image: {
        type: String // URL to product image
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Reference to the category this product belongs to
    },
    stock: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the user who created the product
    }
},
{
    timestamps: { currentTime: () => moment().add(2, 'hours').toDate()}
}
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
