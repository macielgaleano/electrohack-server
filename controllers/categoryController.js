const Category = require("../models/Category");

module.exports = {
  show: async (req, res) => {
    const categories = await Category.find({});
    return res.json(categories);
  },
  delete: async (req, res) => {
    await Category.deleteOne({ name: req.body.name });
    res.json("Categoría eliminada");
  },
  update: async (req, res) => {
    await Category.findOneAndUpdate(name, {
      name: req.body.name,
    });
    res.json("Categoría actualizada");
  },
};
