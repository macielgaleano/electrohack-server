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
    console.log(req.body);
  },
};

module.exports = productController;
