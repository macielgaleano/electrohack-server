const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = {
  store: (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    let user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      phone: req.body.phone,
      orders: [],
    });
    user.save();
    res.json({});
  },

  delete: async (req, res) => {
    const user = await User.findById(req.params.id.toString());
    await User.deleteOne({ _id: req.params.id.toString() });
  },
};
