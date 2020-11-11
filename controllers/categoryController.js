const Category = require("../models/Category");

module.exports = {
  show: async (req, res) => {
    const categories = await Category.find({});
    return res.json(categories);
  },
};
