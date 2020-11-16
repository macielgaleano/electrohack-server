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
    res.json({ Exitoso: "El usuario se eliminó correctamente" });
  },
  update: async (req, res) => {
    await User.findOneAndUpdate(req.user.id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
    });
    res.json("El usuario se modificó correctamente");
  },
  updatePassword: async (req, res) => {
    await User.findOneAndUpdate(id, {
      password: req.body.password,
    });
    res.json("El usuario actualizó su contraseña");
  },
  show: async (req, res) => {
    const users = await User.find({});
    res.json(users);
  },
  /* VER QUE ONDA showOne: async (req, res) => {
    const user = User.findOne({ email: req.body.email });
    res.json(user);
  }, */
};
