const Category = require("../models/Category");

module.exports = {
  show: async (req, res) => {
    const categories = Category.find({});
    return res.json(categories);
  },
};
