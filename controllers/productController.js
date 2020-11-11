const db = require("../models/index");
const Product = require("../models/Product");

const productController = {
  all: async (req, res) => {
    res.json(await Product.find({}));
  },
  show: async (req, res) => {
    res.json(await Product.find({ slug: req.params.slug }));
  },
  store: async (req, res) => {
    let {
      name,
      description,
      price,
      brand,
      pictures,
      stock,
      category,
      outstanding,
    } = req.body;
    let product = new Product({
      name: name,
      description: description,
      price: price,
      brand: brand,
      pictures: pictures,
      stock: stock,
      category: category,
      outstanding: outstanding,
    });
    product.save();
    res.json(product);
  },
};

module.exports = productController;
