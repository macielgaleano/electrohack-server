const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slugify = require("slugify");

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
    slug: "",
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  var user = this;
  user.slug = slugify(user.name);
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
