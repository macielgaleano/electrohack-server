const db = require("../models/index");
const Product = require("../models/Product");

const productController = {
  all: async (req, res) => {
    res.json(await Product.find({}));
  },
  show: async (req, res) => {
    res.json(await Product.find({ slug: req.params.slug }));
  },
  updateImage: (req, res) => {},
  update: async (req, res) => {
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
    Product.updateOne(
      { name: name },
      {
        name: name,
        description: description,
        price: price,
        brand: brand,
        pictures: pictures,
        stock: stock,
        category: category,
        outstanding: outstanding,
      }
    );
    res.json({ messague: "Datos actualizados" });
  },
  delete: async (req, res) => {
    if (req.body.slug) {
      Product.deleteOne({ slug: req.body.slug });
      res.status(200).json({ messague: "Producto eliminado" });
    } else {
      res.status(401).json({ status: 401, error: "No existe el producto" });
    }
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

  showCategories: async (req, res) => {
    const products = Product.find({});
    console.log("anda");
    products.map((product) => {
      return product.category;
    });
  },

  showByCategory: async (req, res) => {
    const products = Product.find({ category: req.body.category });
    res.json(products);
  },
};

module.exports = productController;
