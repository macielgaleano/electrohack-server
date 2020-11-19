const Admin = require("../models/Admin");

module.exports = {
  isAdmin: async (req, res, next) => {
    console.log(req.user);
    if (req.user.id) {
      const admin = await Admin.findById(req.user.id);
      console.log(admin);
      if (admin.active) {
        next();
      } else {
        res.status(404).json("Error");
      }
    }
  },
};
