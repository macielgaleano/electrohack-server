const db = require("./models/index");
const Admin = require("./models/Admin");

const seeder = {
  createData: (req, res) => {
    //Crear el primer usuario admin
    const adminUser = new Admin({
      firstname: "root",
      lastname: "root",
      email: "root@gmail.com",
      password: "1234",
    });
    adminUser.save();
    res.json(adminUser);
  },
};

module.exports = seeder;
