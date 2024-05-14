import mongoose from "mongoose";
import moment from "moment";
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        default:0
    },
    paymentMethod: {
        type: String,
        default:'Cash On Delivery' // Only allow cash on delivery as payment method
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
        default: 'Pending'
    }
}, {
    timestamps: { currentTime: () => moment().add(2, 'hours').toDate() }
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
