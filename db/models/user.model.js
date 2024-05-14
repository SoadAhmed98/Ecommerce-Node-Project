import mongoose, { Schema } from "mongoose";
import moment from "moment";
// Define the address schema
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength:3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: [addressSchema] // Array of addresses
},
{
    timestamps: { currentTime: () => moment().add(2, 'hours').toDate()}
}
);

const UserModel=mongoose.model("User",userSchema);
export default UserModel;
