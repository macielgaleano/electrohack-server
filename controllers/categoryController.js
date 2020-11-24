const Category = require("../models/Category");

module.exports = {
  store: async (req, res) => {
    const sercheadCategory = await Category.findOne({ name: req.body.name });
    if (!sercheadCategory) {
      let category = new Category({
        name: req.body.name,
      });
      category.save();
      res.json({
        Message: "Categoria creada correctamente",
        category: category,
      });
    } else {
      res.json({ Message: "La categoría ingresada ya existe" });
    }
  },
  show: async (req, res) => {
    const categories = await Category.find({});
    return res.json(categories);
  },
  delete: async (req, res) => {
    await Category.deleteOne({ name: req.body.name });
    res.json("Categoría eliminada");
  },
  update: async (req, res) => {
    await Category.findOneAndUpdate(
      { name: req.body.nameToSearch },
      {
        name: req.body.newCategoryName,
      }
    );

    res.json("Categoría actualizada");
  },
};
