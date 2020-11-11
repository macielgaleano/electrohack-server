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
    slug: String,
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("slug")) return next();
]
      next();
   
});

productSchema.slug = slugify(productSchema.name);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
