const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

module.exports = {
  store: (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    let admin = new Admin({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });
    admin.save();
    res.json({});
  },
};
