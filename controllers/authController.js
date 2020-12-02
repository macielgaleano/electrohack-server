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
      res.status(200).json({
        user: newUser,
        token: token,
        Exitoso: "Usuario creado correctamente",
      });
    } else {
      res.status(200).json({ Error: "El usuario ya existe" });
    }
  },

  login: async (req, res) => {
    let user = await User.findOne({ email: req.body.email });

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

        res.json({ token, user });
      }
    }
  },
  logout: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    user.tokens = user.tokens.filter((token) => req.body.token !== token);
    user.save();
    res.json({ Exitoso: "Te deslogueaste correctamente" });
  },
  adminLogin: async (req, res) => {
    let admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      res.json({ Error: "Datos incorrectos1" });
    } else {
      const result = await bcrypt.compare(req.body.password, admin.password);

      if (!result) {
        res.json({ Error: "Datos incorrectos2" });
      } else {
        const token = jwt.sign(
          {
            id: admin.id,
            firstname: admin.firstname,
            lastname: admin.lastname,
          },
          process.env.SECRET
        );
        admin.tokens.push(token);
        admin.save();

        res.json({ token });
      }
    }
  },
  adminLogout: async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });
    admin.tokens = admin.tokens.filter((token) => req.body.token !== token);
    admin.save();
    res.json({ Exitoso: "Te deslogueaste correctamente" });
  },
  adminLogout: async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });
    admin.tokens = admin.tokens.filter((token) => req.body.token !== token);
    admin.save();
    res.json({ Exitoso: "Te deslogueaste correctamente" });
  },
};
