import mongoose from "mongoose"
import moment from "moment";
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        minLength:3
    },
    image: {
        type: String // URL to category image
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the user who created the category
    }
},
{
    timestamps: { currentTime: () => moment().add(2, 'hours').toDate()}
}
);

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;