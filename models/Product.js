const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: String,
    description: String,
    price: Number,
    brand: String,
    pictures: [],
    stock: Number,
    category: String,
    outstanding: Boolean,
    slug: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
