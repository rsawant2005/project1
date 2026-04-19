import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    badge: {
        type: String
    },
    description: {
        type: String
    },
    unit: {
        type: String,
        default: 'KG'
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
