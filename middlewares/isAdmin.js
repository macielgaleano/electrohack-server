const Admin = require("../models/Admin");

module.exports = {
  isAdmin(req, res, next) {
    if (req.user.id) {
      const admin = Admin.findOne({ id: req.user.id });
      if (admin.active) {
        next();
      } else {
        res.status(404).json("Error");
      }
    }
  },
};
