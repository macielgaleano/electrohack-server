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
  delete: async (req, res) => {
    await Admin.deleteOne({ email: req.body.email });
    res.json("El admin se eliminó correctamente");
  },
  update: async (req, res) => {
    await Admin.findOneAndUpdate(id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });
    res.json("El admin se modificó correctamente");
  },
  updatePassword: async (req, res) => {
    await Admin.findOneAndUpdate(id, {
      password: req.body.password,
    });
    res.json("El admin actualizó su contraseña");
  },
};
