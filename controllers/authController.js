const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone,
        tokens: [],
        orders: [],
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
        process.env.SECRET
      );
      newUser.tokens.push(token);
      newUser.save();
      res
        .status(200)
        .json({ token: token, Exitoso: "Usuario creado correctamente" });
    } else {
      res.status(200).json({ Error: "El usuario ya existe" });
    }
  },

  login: async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = await Admin.findOne({ email: req.body.email });
    }
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
        user.tokens.push(token);
        user.save();

        res.json({ token });
      }
    }
  },
  logout: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    user.tokens = user.tokens.filter((token) => req.body.token !== token);
    user.save();
    res.json({ Exitoso: "Te deslogueaste correctamente" });
  },
};
