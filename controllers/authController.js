const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { findOne } = require("../models/User");

module.exports = {
  register: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!user) {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        phone: req.body.phone,
        orders: [],
      });
      newUser.save();
      const token = jwt.sign(
        {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
        process.env.SECRET
      );

      res
        .status(200)
        .json({ token: token, Exitoso: "Usuario creado correctamente" });
    } else {
      res.status(200).json({ Error: "El usuario ya existe" });
    }
  },

  login: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.json({ Error: "Datos incorrectos" });
    } else {
      const result = await bcrypt.compare(req.body.password, user.password);

      if (!result) {
        res.json({ Error: "Datos incorrectos" });
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          process.env.SECRET
        );

        res.json({ token });
      }
    }
  },
};
