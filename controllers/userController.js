const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = {
  store: (req, res) => {
    let user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,
      orders: [],
    });
    user.save();
    res.json({});
  },
  delete: async (req, res) => {
    await User.deleteOne({ email: req.body.email });
  },
};
