const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: String,
    reviews: [{
        reviewer: {
            type: Schema.Types.ObjectId,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }]

});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
