const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

module.exports = {
  store: (req, res) => {
    let admin = new Admin({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });

    admin.save();
    res.json("Admin creado");
  },
  delete: async (req, res) => {
    await Admin.deleteOne({ email: req.body.email });
    res.json("El admin se eliminó correctamente");
  },

  updatePassword: async (req, res) => {
    await Admin.findOneAndUpdate(id, {
      password: req.body.password,
    });
    res.json("El admin actualizó su contraseña");
  },
  show: async (req, res) => {
    const admin = await Admin.find({});
    res.json(admin);
  },

  update: async (req, res) => {
    let { firstname, lastname, email } = req.body;
    let admin = await Admin.findOne({ id: req.body.id });
    if (await admin) {
      admin.firstname = firstname;
      admin.lastname = lastname;
      admin.email = email;
      admin.save();
      res.json("El administrador fue actualizado correctamente");
    } else {
      res.json({ message: "Admin no existe" });
    }
  },
};
