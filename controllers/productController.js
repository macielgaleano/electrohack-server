const db = require("../models/index");
const Product = require("../models/Product");

const productController = {
  all: async (req, res) => {
    res.json(await Product.find({}));
  },
};

module.exports = productController;
