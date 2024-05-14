import mongoose from "mongoose";
import moment from "moment";
const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expireIn: {
        type: Date,
        required: true
    }
}, 
 { 
    timestamps: { currentTime: () => moment().add(2, 'hours').toDate()}
 }
 );

const CouponModel = mongoose.model('Coupon', couponSchema);

export default CouponModel;
